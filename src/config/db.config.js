// src/config/db.config.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql', // ¡Confirmado: MySQL!
        logging: false, // Desactiva el log de queries SQL
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('📦 Conexión a la base de datos MySQL establecida.');
        // Sincroniza los modelos (crea las tablas si no existen)
        await sequelize.sync({ alter: true }); 
    } catch (error) {
        console.error('❌ Error al conectar la DB:', error.message);
        process.exit(1); 
    }
};

module.exports = { sequelize, connectDB };