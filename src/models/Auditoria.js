// src/models/Auditoria.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Usuario = require('./Usuario');

const Auditoria = sequelize.define('Auditoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    accion: { // Ejemplo: 'CREAR_PROYECTO', 'ACTUALIZAR_USUARIO', 'ELIMINAR_IMAGEN'
        type: DataTypes.STRING,
        allowNull: false,
    },
    entidad: { // La tabla afectada: 'Proyecto', 'Usuario', 'ImagenProyecto'
        type: DataTypes.STRING,
        allowNull: false,
    },
    entidadId: { // El ID del registro afectado
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    detalles: { // Información adicional sobre el cambio (JSON string)
        type: DataTypes.TEXT,
        allowNull: true,
    },
    // Clave foránea al usuario que ejecutó la acción
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id',
        }
    }
}, {
    tableName: 'Auditorias',
    timestamps: true,
});

module.exports = Auditoria;