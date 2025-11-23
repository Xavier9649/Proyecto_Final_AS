const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql', // ¡Confirmado: MySQL!
        logging: false, // Desactiva el log de queries SQL
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('📦 Conexión a la base de datos MySQL establecida.');
        
        // =========================================================================
        // === PASO CRÍTICO: REINICIO FORZADO PARA SOLUCIONAR "Too Many Keys" ===
        // =========================================================================
        // Usar { force: true } eliminará y recreará TODAS las tablas.
        // Esto limpia los índices corruptos de intentos anteriores.
        await sequelize.sync({ alter: true }); 
        
        console.log('✅ Tablas sincronizadas y recreadas exitosamente.');

        // =========================================================================
        // === IMPORTANTE: VUELVE A CAMBIARLO DESPUÉS DE LA SINCRONIZACIÓN EXITOSA ===
        // =========================================================================
        // Después de que esta sincronización con 'force: true' funcione, 
        // CAMBIA la línea de arriba a: await sequelize.sync({ alter: true });
        // o simplemente: await sequelize.sync(); 
        
    } catch (error) {
        console.error('❌ Error al conectar la DB:', error.message);
        // Si el error persiste, podría indicar un problema de configuración de MySQL.
        process.exit(1); 
    }
};

module.exports = { sequelize, connectDB };