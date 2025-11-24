const Auditoria = require('../models/Auditoria');
const Usuario = require('../models/Usuario'); // Necesario para incluir quién hizo la acción

/**
 * Registra una actividad en el log de auditoría.
 * (Esta es tu función existente)
 */
const logActivity = async (usuarioId, accion, entidad, entidadId, detalles = {}) => {
    try {
        await Auditoria.create({
            usuarioId,
            accion,
            entidad,
            entidadId,
            detalles: JSON.stringify(detalles), // Guardar el objeto como string JSON
        });
    } catch (error) {
        console.error(`Error al registrar actividad de auditoría para ${accion}:`, error.message);
    }
};

/**
 * NUEVA FUNCIÓN: Obtiene el historial de auditoría.
 * (Ordenado por más reciente primero)
 */
const getAuditLog = async () => {
    return await Auditoria.findAll({
        order: [['fecha', 'DESC']], // Ordenar por fecha de creación descendente
        include: [
            {
                model: Usuario,
                as: 'ejecutor', // 'ejecutor' (definido en associations.js)
                attributes: ['id', 'nombre', 'email', 'rol'] // Datos del usuario
            }
        ]
    });
};

module.exports = { 
    logActivity,
    getAuditLog // <-- Nueva exportación
};