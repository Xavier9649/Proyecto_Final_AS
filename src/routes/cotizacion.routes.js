const express = require('express');
const router = express.Router();
// Asumiendo que tienes un controlador. Si no, crea uno dummy por ahora.
const cotizacionController = require('../controllers/cotizacion.controller'); 
const { verifyToken } = require('../middlewares/auth.middleware');

// POST /api/quotations - Crear solicitud
router.post('/', verifyToken, cotizacionController.crearCotizacion);

// GET /api/quotations - Obtener cotizaciones (filtradas por rol en el controlador)
router.get('/', verifyToken, cotizacionController.obtenerCotizaciones);

// PUT /api/quotations/:id/assign - Asignar arquitecto
router.put('/:id/assign', verifyToken, cotizacionController.asignarArquitecto);

// PUT /api/quotations/:id/status - Cambiar estado
router.put('/:id/status', verifyToken, cotizacionController.cambiarEstado);

module.exports = router;