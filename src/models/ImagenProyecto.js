// src/models/ImagenProyecto.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Proyecto = require('./Proyecto');

const ImagenProyecto = sequelize.define('ImagenProyecto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    url: { // URL de la imagen almacenada (S3, Cloudinary o local)
        type: DataTypes.STRING,
        allowNull: false,
    },
    esPrincipal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // Clave foránea al proyecto
    proyectoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Proyecto,
            key: 'id',
        }
    }
}, {
    tableName: 'ImagenesProyecto',
    timestamps: true,
});

module.exports = ImagenProyecto;