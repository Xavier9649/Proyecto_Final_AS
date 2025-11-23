const Usuario = require('./Usuario');
const Proyecto = require('./Proyecto');
const ImagenProyecto = require('./ImagenProyecto');
const Auditoria = require('./Auditoria');
const Cotizacion = require('./Cotizacion');

// =================================================
// === RELACIONES DE PROYECTO ======================
// =================================================

// 1. Un Usuario (Admin/Arq) crea muchos Proyectos
Usuario.hasMany(Proyecto, { foreignKey: 'usuarioId', as: 'proyectosCreados', onDelete: 'RESTRICT' });
Proyecto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'creador', targetKey: 'id' });

// 2. Un Proyecto tiene muchas Imágenes
Proyecto.hasMany(ImagenProyecto, { 
    foreignKey: 'proyectoId', 
    as: 'imagenes', 
    onDelete: 'CASCADE' // Si se borra el proyecto, se borran sus imágenes
});
ImagenProyecto.belongsTo(Proyecto, { foreignKey: 'proyectoId', as: 'proyecto', targetKey: 'id' });

// =================================================
// === RELACIONES DE AUDITORÍA =====================
// =================================================

// 3. Un Usuario genera muchos registros de Auditoría
Usuario.hasMany(Auditoria, { foreignKey: 'usuarioId', as: 'registrosAuditoria', onDelete: 'SET NULL' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'ejecutor', targetKey: 'id' });

// =================================================
// === RELACIONES DE COTIZACIONES (MÓDULO 3) =======
// =================================================

// 4. Un Usuario (Cliente) solicita muchas Cotizaciones
Usuario.hasMany(Cotizacion, { foreignKey: 'clienteId', as: 'cotizacionesSolicitadas', onDelete: 'RESTRICT' });
Cotizacion.belongsTo(Usuario, { foreignKey: 'clienteId', as: 'cliente', targetKey: 'id' });

// 5. Un Usuario (Arquitecto) tiene muchas Cotizaciones asignadas
Usuario.hasMany(Cotizacion, { foreignKey: 'arquitectoId', as: 'cotizacionesAsignadas', onDelete: 'SET NULL' });
Cotizacion.belongsTo(Usuario, { foreignKey: 'arquitectoId', as: 'arquitecto', targetKey: 'id' });

// 6. Un Proyecto tiene muchas Cotizaciones asociadas (Interés del cliente)
Proyecto.hasMany(Cotizacion, { foreignKey: 'proyectoId', as: 'solicitudesCotizacion', onDelete: 'RESTRICT' });
Cotizacion.belongsTo(Proyecto, { foreignKey: 'proyectoId', as: 'proyectoInteres', targetKey: 'id' });

// =================================================
// === EXPORTACIÓN =================================
// =================================================

module.exports = {
    Usuario,
    Proyecto,
    ImagenProyecto,
    Auditoria,
    Cotizacion
};