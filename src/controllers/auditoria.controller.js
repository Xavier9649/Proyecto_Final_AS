const auditoriaService = require('../services/auditoria.service');

/**
 * Manejador para obtener el historial de auditoría.
 */
const handleGetAuditLog = async (req, res) => {
    try {
        // Llama al servicio para obtener todos los logs
        const log = await auditoriaService.getAuditLog();
        res.status(200).json(log);
    } catch (error) {
        console.error('Error al obtener el log de auditoría:', error);
        res.status(500).json({ error: 'Error interno al obtener el historial.' });
    }
};

module.exports = {
    handleGetAuditLog
};