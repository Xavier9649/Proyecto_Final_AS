import { Cotizacion } from "../models/Cotizacion.js";
import { Usuario } from "../models/Usuario.js";

export const CotizacionService = {

    async crearCotizacion(usuarioId, mensaje) {
        return await Cotizacion.create({
            usuarioId,
            mensaje,
            estado: "pendiente"
        });
    },

    async obtenerCotizacionesPorRol(usuario) {
        if (usuario.rol === "admin") {
            return await Cotizacion.findAll({ include: Usuario });
        }

        if (usuario.rol === "architect") {
            // Arquitecto ve solo asignadas a él
            return await Cotizacion.findAll({
                where: { asignadoA: usuario.id },
                include: Usuario
            });
        }

        // Cliente ve solo SUS solicitudes
        return await Cotizacion.findAll({
            where: { usuarioId: usuario.id }
        });
    },

    async asignarArquitecto(cotizacionId, arquitectoId) {
        const cot = await Cotizacion.findByPk(cotizacionId);
        if (!cot) return null;

        await cot.update({
            estado: "asignada",
            asignadoA: arquitectoId
        });

        return cot;
    },

    async actualizarEstado(cotizacionId, estado) {
        const cot = await Cotizacion.findByPk(cotizacionId);
        if (!cot) return null;

        await cot.update({ estado });
        return cot;
    }
};
