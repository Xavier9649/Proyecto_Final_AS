const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    passwordHash: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'ARCHITECT', 'CLIENT'),
        defaultValue: 'CLIENT', 
        allowNull: false,
    },
    // --- CAMPOS PARA RECUPERACIÓN DE CONTRASEÑA ---
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
}, {
    tableName: 'Usuarios',
    timestamps: true,
    defaultScope: {
        // Excluir datos sensibles por defecto
        attributes: { exclude: ['passwordHash', 'resetPasswordToken', 'resetPasswordExpires'] }
    },
    scopes: {
        withHash: {
            attributes: { include: ['passwordHash'] }
        },
        withResetToken: {
            // Scope necesario para buscar por el token de reseteo
            attributes: { include: ['resetPasswordToken', 'resetPasswordExpires'] }
        }
    }
});

module.exports = Usuario;