const { Router } = require('express');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { 
    handleCreate, 
    handleGetAll, 
    handleAssign, 
    handleUpdateStatus 
} = require('../controllers/cotizacion.controller');

const router = Router();

// 1. Crear Cotización (Cualquier usuario logueado, idealmente CLIENT)
router.post('/', verifyToken, handleCreate);

// 2. Listar Cotizaciones (El servicio filtra qué ve cada quien)
router.get('/', verifyToken, handleGetAll);

// 3. Asignar Arquitecto (Solo ADMIN)
router.put('/:id/assign', verifyToken, checkRole(['ADMIN']), handleAssign);

// 4. Actualizar Estado (Solo ARCHITECT)
router.put('/:id/status', verifyToken, checkRole(['ARCHITECT']), handleUpdateStatus);

module.exports = router;