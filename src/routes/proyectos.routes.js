// src/routes/proyectos.routes.js
const { Router } = require('express');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');
const { 
    handleCreateProject, 
    handleGetProjects, 
    handleGetProjectById,
    handleUpdateProject,
    handleDeleteProject,
    handleAddImage,
    handleDeleteImage // <-- Nueva importación: Controlador para eliminar imagen
} = require('../controllers/proyecto.controller');

const router = Router();

// POST: Crear Proyecto
router.post(
    '/', 
    verifyToken, 
    checkRole(['ADMIN', 'ARCHITECT']), 
    handleCreateProject
);

// GET: Listar todos los Proyectos (Público)
router.get('/', handleGetProjects);

// GET: Obtener Proyecto por ID (Público)
router.get('/:id', handleGetProjectById);

// PUT: Actualizar Proyecto
router.put(
    '/:id', 
    verifyToken, 
    checkRole(['ADMIN', 'ARCHITECT']), 
    handleUpdateProject
);

// DELETE: Eliminar Proyecto (Solo ADMIN)
router.delete(
    '/:id', 
    verifyToken, 
    checkRole(['ADMIN']), 
    handleDeleteProject
);

// POST: Subir Imagen a un Proyecto
router.post(
    '/:id/images', 
    verifyToken, 
    checkRole(['ADMIN', 'ARCHITECT']), 
    upload.single('imagen'),
    handleAddImage
);

// DELETE: Eliminar Imagen de un Proyecto (NUEVA RUTA)
// URL: /api/proyectos/1/images/1
router.delete(
    '/:proyectoId/images/:imagenId', 
    verifyToken, 
    checkRole(['ADMIN', 'ARCHITECT']), 
    handleDeleteImage // <-- Controlador para borrar DB y archivo físico
);

module.exports = router;