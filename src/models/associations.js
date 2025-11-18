// src/models/associations.js
const Usuario = require('./Usuario');
const Proyecto = require('./Proyecto');
const ImagenProyecto = require('./ImagenProyecto');
const Auditoria = require('./Auditoria');

// --- Relaciones de Proyecto ---
// 1. Un Usuario puede crear muchos Proyectos
Usuario.hasMany(Proyecto, { foreignKey: 'usuarioId', as: 'proyectosCreados' });
Proyecto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'creador' });

// 2. Un Proyecto puede tener muchas Imágenes
Proyecto.hasMany(ImagenProyecto, { foreignKey: 'proyectoId', as: 'imagenes', onDelete: 'CASCADE' }); // Si se borra el proyecto, se borran las imágenes
ImagenProyecto.belongsTo(Proyecto, { foreignKey: 'proyectoId', as: 'proyecto' });

// --- Relaciones de Auditoría ---
// 3. Un Usuario genera muchos Registros de Auditoría
Usuario.hasMany(Auditoria, { foreignKey: 'usuarioId', as: 'registrosAuditoria' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'ejecutor' });

// Los otros modelos (Proyecto, ImagenProyecto) no tienen relación directa
// con Auditoria, solo a través de 'entidad' y 'entidadId'.

module.exports = {
    Usuario,
    Proyecto,
    ImagenProyecto,
    Auditoria
};