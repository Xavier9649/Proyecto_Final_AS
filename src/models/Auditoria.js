// ... (resto de imports)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config'); // Asegúrate de importar tu instancia de sequelize

const Auditoria = sequelize.define('Auditoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    accion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    entidad: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    registroId: {
        type: DataTypes.INTEGER,
        allowNull: true, // El ID del registro afectado (puede ser nulo si es una acción global)
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    // =======================================================
    // === ESTE ES EL CAMBIO CLAVE: allow NULO para SET NULL ===
    // =======================================================
    usuarioId: { 
        type: DataTypes.INTEGER,
        allowNull: true, // <-- DEBE ser TRUE para que onDelete: 'SET NULL' funcione
        // La referencia real se define en associations.js, pero la nulidad va aquí.
    },
    // ... otros campos si los tienes
}, {
    tableName: 'Auditorias',
    timestamps: false // Los logs de auditoría generalmente no usan timestamps de Sequelize
});

module.exports = Auditoria;