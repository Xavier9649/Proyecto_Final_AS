const cotizacionService = require('../services/cotizacion.service');

const handleCreate = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body; // { mensaje, proyectoId }
        const result = await cotizacionService.createCotizacion(data, userId);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const handleGetAll = async (req, res) => {
    try {
        const { id, rol } = req.user;
        const result = await cotizacionService.getCotizaciones(id, rol);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleAssign = async (req, res) => {
    try {
        const { id } = req.params; // ID de la cotización
        const { arquitectoId } = req.body; // ID del arquitecto a asignar
        const adminId = req.user.id;

        const result = await cotizacionService.assignArchitect(id, arquitectoId, adminId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const handleUpdateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, precioEstimado } = req.body;
        const userId = req.user.id;

        const result = await cotizacionService.updateStatus(id, estado, precioEstimado, userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    handleCreate,
    handleGetAll,
    handleAssign,
    handleUpdateStatus
};