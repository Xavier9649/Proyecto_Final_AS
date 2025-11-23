const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Cotizacion = sequelize.define('Cotizacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    fechaSolicitud: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    precioEstimado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM('PENDIENTE', 'ASIGNADA', 'EN_REVISION', 'FINALIZADA', 'RECHAZADA'),
        defaultValue: 'PENDIENTE',
    },
    
    // --- CLAVES FORÁNEAS SIMPLIFICADAS ---
    // Solo declaramos el tipo de dato, las asociaciones (FKs y sus índices) 
    // se manejan en el archivo de asociaciones.js para evitar duplicidad.
    clienteId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        // ELIMINADAS LAS REFERENCIAS EXPLICITAS (references: {})
    },
    arquitectoId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        // ELIMINADAS LAS REFERENCIAS EXPLICITAS (references: {})
    },
    proyectoId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        // ELIMINADAS LAS REFERENCIAS EXPLICITAS (references: {})
    }
}, {
    tableName: 'Cotizaciones',
    timestamps: true,
});

module.exports = Cotizacion;