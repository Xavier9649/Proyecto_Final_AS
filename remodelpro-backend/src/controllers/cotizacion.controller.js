import { CotizacionService } from "../services/cotizacion.service.js";

export const CotizacionController = {

    async crear(req, res) {
        try {
            const usuarioId = req.user.id;
            const { mensaje } = req.body;

            const cot = await CotizacionService.crearCotizacion(usuarioId, mensaje);

            res.status(201).json(cot);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async listar(req, res) {
        try {
            const cotizaciones = await CotizacionService.obtenerCotizacionesPorRol(req.user);
            res.json(cotizaciones);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async asignar(req, res) {
        try {
            const { id } = req.params;
            const { arquitectoId } = req.body;

            const cot = await CotizacionService.asignarArquitecto(id, arquitectoId);
            if (!cot) return res.status(404).json({ error: "Cotización no encontrada" });

            res.json({ mensaje: "Arquitecto asignado", cotizacion: cot });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async actualizarEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const cot = await CotizacionService.actualizarEstado(id, estado);
            if (!cot) return res.status(404).json({ error: "Cotización no encontrada" });

            res.json({ mensaje: "Estado actualizado", cotizacion: cot });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
