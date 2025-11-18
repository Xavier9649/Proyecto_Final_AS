// src/models/Proyecto.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Usuario = require('./Usuario');

const Proyecto = sequelize.define('Proyecto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fechaFinEstimada: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM('PLANIFICACION', 'EN_PROGRESO', 'FINALIZADO', 'CANCELADO'),
        defaultValue: 'PLANIFICACION',
    },
    // Clave foránea al usuario (Arquitecto/Administrador) que gestiona el proyecto
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id',
        }
    }
}, {
    tableName: 'Proyectos',
    timestamps: true,
});

module.exports = Proyecto;