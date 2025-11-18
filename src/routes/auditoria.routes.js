const { Router } = require('express');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { handleGetAuditLog } = require('../controllers/auditoria.controller');

const router = Router();

// GET: Obtener todo el historial de auditoría (Solo ADMIN)
// Ruta: GET /api/auditorias/
router.get(
    '/',
    verifyToken,
    checkRole(['ADMIN']), // Solo el ADMIN puede ver el log
    handleGetAuditLog
);

module.exports = router;