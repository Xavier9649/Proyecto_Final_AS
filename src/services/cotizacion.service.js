const { Cotizacion, Usuario, Proyecto } = require('../models/associations');
const { logActivity } = require('./auditoria.service');

// 1. Crear Cotización (Cliente)
const createCotizacion = async (data, userId) => {
    const nuevaCotizacion = await Cotizacion.create({
        ...data,
        clienteId: userId,
        estado: 'PENDIENTE'
    });

    await logActivity(userId, 'CREAR_COTIZACION', 'Cotizacion', nuevaCotizacion.id, { mensaje: data.mensaje });
    return nuevaCotizacion;
};

// 2. Obtener Cotizaciones
const getCotizaciones = async (userId, userRol) => {
    let filtro = {};

    if (userRol === 'CLIENT') filtro = { clienteId: userId };
    else if (userRol === 'ARCHITECT') filtro = { arquitectoId: userId };

    return await Cotizacion.findAll({
        where: filtro,
        include: [
            { model: Usuario, as: 'cliente', attributes: ['id', 'nombre', 'email'] },
            { model: Usuario, as: 'arquitecto', attributes: ['id', 'nombre', 'email'] },
            { model: Proyecto, as: 'proyectoInteres', attributes: ['id', 'nombre'] }
        ],
        order: [['createdAt', 'DESC']]
    });
};

// 3. Asignar Arquitecto
const assignArchitect = async (cotizacionId, arquitectoId, adminId) => {
    const cotizacion = await Cotizacion.findByPk(cotizacionId);
    if (!cotizacion) throw new Error('Cotización no encontrada');

    const arquitecto = await Usuario.findByPk(arquitectoId);
    if (!arquitecto || arquitecto.rol !== 'ARCHITECT') {
        throw new Error('El usuario asignado no es un Arquitecto válido');
    }

    cotizacion.arquitectoId = arquitectoId;
    cotizacion.estado = 'ASIGNADA';
    await cotizacion.save();

    await logActivity(adminId, 'ASIGNAR_ARQUITECTO', 'Cotizacion', cotizacion.id, { arquitecto: arquitecto.nombre });
    return cotizacion;
};

// 4. Actualizar Estado
const updateStatus = async (cotizacionId, nuevoEstado, precioEstimado, userId) => {
    const cotizacion = await Cotizacion.findByPk(cotizacionId);
    if (!cotizacion) throw new Error('Cotización no encontrada');

    if (cotizacion.arquitectoId !== userId) {
        throw new Error('No tienes permiso para modificar esta cotización');
    }

    cotizacion.estado = nuevoEstado;
    if (precioEstimado) cotizacion.precioEstimado = precioEstimado;

    await cotizacion.save();

    await logActivity(userId, 'ACTUALIZAR_ESTADO_COTIZACION', 'Cotizacion', cotizacion.id, { estado: nuevoEstado });
    return cotizacion;
};

// 5. ELIMINAR COTIZACIÓN
const deleteCotizacion = async (id) => {
    return await Cotizacion.destroy({ where: { id } });
};

module.exports = {
    createCotizacion,
    getCotizaciones,
    assignArchitect,
    updateStatus,
    deleteCotizacion
};
