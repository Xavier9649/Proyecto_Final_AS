// src/controllers/proyecto.controller.js
const proyectoService = require('../services/proyecto.service');
const fs = require('fs');
const path = require('path');

// --- CONTROLADORES CRUD PROYECTO ---

const handleCreateProject = async (req, res) => {
    try {
        const usuarioId = req.user.id; 
        const data = req.body;
        const nuevoProyecto = await proyectoService.createProject(data, usuarioId);
        res.status(201).json(nuevoProyecto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const handleGetProjects = async (req, res) => {
    try {
        const proyectos = await proyectoService.getAllProjects();
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
};

const handleGetProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await proyectoService.getProjectById(id);
        res.json(proyecto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const handleUpdateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id;
        const data = req.body;
        const proyectoActualizado = await proyectoService.updateProject(id, data, usuarioId);
        res.json(proyectoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const handleDeleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id;
        const resultado = await proyectoService.deleteProject(id, usuarioId);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// --- CONTROLADORES DE IMÁGENES ---

const handleAddImage = async (req, res) => {
    const { id: proyectoId } = req.params;
    const usuarioId = req.user.id; 
    
    if (!req.file) {
        return res.status(400).json({ error: "No se encontró ningún archivo para subir." });
    }
    const imageFullPath = req.file.path; 

    try {
        const imageRelativePath = path.join('uploads', 'proyectos', req.file.filename);
        const esPrincipal = req.body.esPrincipal === 'true'; 

        const nuevaImagen = await proyectoService.addImageToProject(
            proyectoId, imageRelativePath, esPrincipal, usuarioId
        );
        res.status(201).json({ message: "Imagen subida exitosamente", imagen: nuevaImagen });

    } catch (error) {
        if (imageFullPath) {
            try {
                // fs.unlinkSync es bloqueante, pero está bien en un catch.
                fs.unlinkSync(imageFullPath); 
            } catch (unlinkError) {
                console.warn(`Advertencia: No se pudo eliminar el archivo subido: ${imageFullPath}. Error: ${unlinkError.message}`);
            }
        }
        res.status(400).json({ error: error.message });
    }
};

// --- NUEVO CONTROLADOR DE ELIMINAR IMAGEN ---

const handleDeleteImage = async (req, res) => {
    // Extraemos ambos IDs de los parámetros de la ruta
    const { proyectoId, imagenId } = req.params;
    const usuarioId = req.user.id; // Del token JWT

    try {
        // Llama al servicio para manejar la lógica de borrado (DB y disco)
        const resultado = await proyectoService.deleteImageFromProject(
            proyectoId, 
            imagenId, 
            usuarioId
        );

        // Respuesta de éxito (200 OK)
        res.status(200).json(resultado);

    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        
        // Manejo de errores específicos del servicio
        if (error.message.includes('Imagen no encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        
        // Error genérico del servidor
        res.status(500).json({ error: 'Ocurrió un error al eliminar la imagen.' });
    }
};

// --- EXPORTACIONES ---

module.exports = {
    handleCreateProject,
    handleGetProjects,
    handleGetProjectById,
    handleUpdateProject,
    handleDeleteProject,
    handleAddImage,
    handleDeleteImage, // <-- **AÑADIDO**
};