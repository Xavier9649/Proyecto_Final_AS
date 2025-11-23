const Proyecto = require('../models/Proyecto');
const ImagenProyecto = require('../models/ImagenProyecto');
const Usuario = require('../models/Usuario'); // Importar Usuario para las inclusiones
const { logActivity } = require('./auditoria.service');
const path = require('path');
const fs = require('fs').promises; // Usamos 'fs.promises' para borrado asíncrono
const { Op } = require('sequelize'); // Necesario para la lógica de 'esPrincipal'

// =================================================
// === 1. FUNCIONES CRUD DE PROYECTOS ==============
// =================================================

const createProject = async (data, usuarioId) => {
    const nuevoProyecto = await Proyecto.create({ ...data, usuarioId });
    
    // Registrar auditoría
    await logActivity(
        usuarioId, 
        'CREAR_PROYECTO', 
        'Proyecto', 
        nuevoProyecto.id, 
        { nombre: nuevoProyecto.nombre }
    );
    
    return nuevoProyecto;
};

const getProjectById = async (proyectoId) => {
    // Buscar proyecto incluyendo imágenes y datos del creador
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
    return await Proyecto.findAll({
        include: [
            { model: ImagenProyecto, as: 'imagenes' },
            { model: Usuario, as: 'creador', attributes: ['id', 'nombre'] } // Solo datos públicos del creador
        ]
    });
};

const updateProject = async (proyectoId, data, usuarioId) => {
    // Verificamos existencia primero
    await getProjectById(proyectoId); 
    
    const [filasAfectadas] = await Proyecto.update(data, { where: { id: proyectoId } });
    
    if (filasAfectadas === 0) throw new Error('No se pudo actualizar el proyecto o no hubo cambios');
    
    await logActivity(
        usuarioId, 
        'ACTUALIZAR_PROYECTO', 
        'Proyecto', 
        proyectoId, 
        { cambios: Object.keys(data) }
    );
    
    return getProjectById(proyectoId);
};

const deleteProject = async (proyectoId, usuarioId) => {
    const proyecto = await getProjectById(proyectoId); 
    
    // Al eliminar el proyecto, Sequelize eliminará las imágenes asociadas (Cascade)
    // Pero idealmente deberíamos borrar los archivos físicos también.
    // (Implementación básica de borrado lógico/db por ahora)
    
    await Proyecto.destroy({ where: { id: proyectoId } });
    
    await logActivity(
        usuarioId, 
        'ELIMINAR_PROYECTO', 
        'Proyecto', 
        proyectoId, 
        { nombre: proyecto.nombre }
    );
    
    return { message: 'Proyecto eliminado exitosamente' };
};

// =================================================
// === 2. FUNCIONES DE GESTIÓN DE IMÁGENES =========
// =================================================

const addImageToProject = async (proyectoId, imagePath, esPrincipal = false, usuarioId) => {
    // 1. Verificar si el proyecto existe
    const proyecto = await Proyecto.findByPk(proyectoId);
    if (!proyecto) {
        throw new Error('Proyecto no encontrado para asignar imagen.');
    }

    // El imagePath del controlador es: 'uploads/proyectos/imagen-X.png'
    // Extraemos solo el nombre del archivo
    const filename = path.basename(imagePath); 
    
    // Construimos la URL pública para la API
    const publicUrl = `/uploads/proyectos/${filename}`; 

    // 2. Crear el registro de la imagen en la DB
    const nuevaImagen = await ImagenProyecto.create({
        proyectoId: proyectoId,
        url: publicUrl, 
        esPrincipal: esPrincipal,
    });

    // 3. Si es principal, quitar 'principal' a las otras imágenes
    if (esPrincipal) {
        await ImagenProyecto.update(
            { esPrincipal: false },
            { 
                where: { 
                    proyectoId: proyectoId, 
                    id: { [Op.ne]: nuevaImagen.id } // Op.ne = Not Equal (No igual al actual)
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

const deleteImageFromProject = async (proyectoId, imagenId, usuarioId) => {
    // 1. Buscar el registro de la imagen en la DB
    // Validamos que la imagen pertenezca al proyecto indicado
    const imagen = await ImagenProyecto.findOne({ 
        where: { id: imagenId, proyectoId: proyectoId }
    });

    if (!imagen) {
        throw new Error('Imagen no encontrada o no pertenece a este proyecto.');
    }

    // 2. Determinar la ruta física del archivo para borrarlo del disco
    const filename = path.basename(imagen.url); 
    const absolutePath = path.join(__dirname, '..', '..', 'uploads', 'proyectos', filename);
    
    // 3. Eliminar el registro de la base de datos
    await ImagenProyecto.destroy({ where: { id: imagenId } });

    try {
        // 4. Eliminar el archivo físico
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
        // Si el archivo ya no existe (ENOENT), no lanzamos error fatal, solo logueamos advertencia
        if (error.code !== 'ENOENT') {
            console.warn(`Advertencia: No se pudo eliminar el archivo físico ${absolutePath}. Error: ${error.message}`);
        }
    }

    return { message: 'Imagen eliminada exitosamente' };
};

// =================================================
// === 3. EXPORTACIÓN (Módulo Único) ===============
// =================================================

module.exports = {
    createProject,
    getProjectById,
    getAllProjects,
    updateProject,
    deleteProject,
    addImageToProject,
    deleteImageFromProject, // ¡Asegúrate de que esté aquí!
};