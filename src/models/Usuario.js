// src/models/Usuario.js
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
    passwordHash: { // Aquí guardamos el hash generado por bcrypt
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'ARCHITECT', 'CLIENT'), // Roles definidos
        defaultValue: 'CLIENT', 
        allowNull: false,
    },
}, {
    tableName: 'Usuarios',
    timestamps: true,
    // Hook para asegurar que nunca devolvemos el hash de la contraseña
    defaultScope: {
        attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] }
    },
    scopes: {
        withHash: {
            attributes: { include: ['passwordHash'] }
        }
    }
});

module.exports = Usuario;