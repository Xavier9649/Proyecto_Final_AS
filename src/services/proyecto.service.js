// src/services/proyecto.service.js
const Proyecto = require('../models/Proyecto');
const ImagenProyecto = require('../models/ImagenProyecto');
const Usuario = require('../models/Usuario'); // Importar Usuario para las inclusiones
const { logActivity } = require('./auditoria.service');
const path = require('path');
const fs = require('fs').promises; // Usamos 'fs.promises' para borrado asíncrono
const { Op } = require('sequelize'); // Necesario para la lógica de 'esPrincipal'

// --- FUNCIONES CRUD PROYECTO ---

const createProject = async (data, usuarioId) => {
    const nuevoProyecto = await Proyecto.create({ ...data, usuarioId });
    await logActivity(usuarioId, 'CREAR_PROYECTO', 'Proyecto', nuevoProyecto.id, { nombre: nuevoProyecto.nombre });
    return nuevoProyecto;
};

const getProjectById = async (proyectoId) => {
    // Buscar proyecto, incluyendo sus imágenes y el creador
    const proyecto = await Proyecto.findByPk(proyectoId, {
        include: [
            { model: ImagenProyecto, as: 'imagenes' },
            { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'email', 'rol'] }
        ]
    });
    if (!proyecto) throw new Error('Proyecto no encontrado');
    return proyecto;
};

const getAllProjects = async () => {
    // Listar todos los proyectos
    return await Proyecto.findAll({
        include: [
            { model: ImagenProyecto, as: 'imagenes' },
            { model: Usuario, as: 'creador', attributes: ['id', 'nombre'] }
        ]
    });
};

const updateProject = async (proyectoId, data, usuarioId) => {
    await getProjectById(proyectoId); // Verifica existencia
    const [filasAfectadas] = await Proyecto.update(data, { where: { id: proyectoId } });
    if (filasAfectadas === 0) throw new Error('No se pudo actualizar el proyecto');
    
    await logActivity(usuarioId, 'ACTUALIZAR_PROYECTO', 'Proyecto', proyectoId, { cambios: Object.keys(data) });
    return getProjectById(proyectoId);
};

const deleteProject = async (proyectoId, usuarioId) => {
    const proyecto = await getProjectById(proyectoId); // Verifica existencia
    await Proyecto.destroy({ where: { id: proyectoId } });
    await logActivity(usuarioId, 'ELIMINAR_PROYECTO', 'Proyecto', proyectoId, { nombre: proyecto.nombre });
    return { message: 'Proyecto eliminado exitosamente' };
};

// --- FUNCIONES DE IMÁGENES ---

const addImageToProject = async (proyectoId, imagePath, esPrincipal = false, usuarioId) => {
    // 1. Verificar si el proyecto existe
    const proyecto = await Proyecto.findByPk(proyectoId);
    if (!proyecto) {
        throw new Error('Proyecto no encontrado para asignar imagen.');
    }

    // El imagePath del controlador es: 'uploads/proyectos/imagen-X.png'
    // Se extrae solo el nombre del archivo para construir la URL pública.
    const filename = path.basename(imagePath); // Extrae 'imagen-X.png'
    const publicUrl = `/uploads/proyectos/${filename}`; // Construye la URL pública

    // 2. Crear el registro de la imagen
    const nuevaImagen = await ImagenProyecto.create({
        proyectoId: proyectoId,
        url: publicUrl, // <-- Usar la URL pública correcta
        esPrincipal: esPrincipal,
    });

    // 3. Si es principal, quitar 'principal' a las otras imágenes del mismo proyecto
    if (esPrincipal) {
        await ImagenProyecto.update(
            { esPrincipal: false },
            { 
                where: { 
                    proyectoId: proyectoId, 
                    id: { [Op.ne]: nuevaImagen.id } // Op.ne significa "not equal"
                } 
            }
        );
    }
    
    // 4. Registrar en auditoría
    await logActivity(
        usuarioId, 
        'SUBIR_IMAGEN', 
        'ImagenProyecto', 
        nuevaImagen.id,
        { proyecto: proyecto.nombre, url: nuevaImagen.url }
    );

    return nuevaImagen;
};

// --- NUEVA FUNCIÓN DE ELIMINAR IMAGEN ---

const deleteImageFromProject = async (proyectoId, imagenId, usuarioId) => {
    // 1. Buscar el registro de la imagen en la DB
    const imagen = await ImagenProyecto.findOne({ 
        where: { id: imagenId, proyectoId: proyectoId }
    });

    if (!imagen) {
        throw new Error('Imagen no encontrada o no pertenece a este proyecto.');
    }

    // 2. Determinar la ruta física del archivo (ej: /uploads/proyectos/img.png)
    const filename = path.basename(imagen.url); 
    // Construye la ruta absoluta al archivo físico
    const absolutePath = path.join(__dirname, '..', '..', 'uploads', 'proyectos', filename);
    
    // 3. Eliminar el registro de la base de datos
    await ImagenProyecto.destroy({ where: { id: imagenId } });

    try {
        // 4. Eliminar el archivo físico del disco
        await fs.unlink(absolutePath);

        // 5. Registrar en auditoría
        await logActivity(
            usuarioId, 
            'ELIMINAR_IMAGEN', 
            'ImagenProyecto', 
            imagenId,
            { proyectoId: proyectoId, url: imagen.url }
        );

    } catch (error) {
        // Si el archivo ya no existe (ENOENT), no lanzamos error, solo registramos.
        if (error.code !== 'ENOENT') {
            console.warn(`Advertencia: No se pudo eliminar el archivo físico ${absolutePath}. Error: ${error.message}`);
        }
    }

    return { message: 'Imagen eliminada exitosamente' };
};

// --- EXPORTACIONES (UN SOLO BLOQUE CORRECTO) ---

module.exports = {
    createProject,
    getProjectById,
    getAllProjects,
    updateProject,
    deleteProject,
    addImageToProject,
    deleteImageFromProject, // <-- ¡LA EXPORTACIÓN QUE FALTABA!
};