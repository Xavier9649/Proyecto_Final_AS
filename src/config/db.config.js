// config/db.config.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Desactiva logs SQL
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

// ===================================================================
// 🔥 CONFIGURACIÓN PROFESIONAL DE BASE DE DATOS
// ===================================================================
//
// MODO DESARROLLO -> sincroniza normalmente sin romper tablas
// MODO RECREAR -> borra todas las tablas y las vuelve a crear (solo cuando tú lo pidas)
// MODO PRODUCCIÓN -> nunca toca la estructura
//
// Usa la variable DB_SYNC:
//
// DB_SYNC=none     → producción
// DB_SYNC=safe     → desarrollo (default)
// DB_SYNC=rebuild  → forzar limpieza total de tablas
//
// ===================================================================

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("📦 Conexión a la base MySQL establecida.");

    const syncMode = process.env.DB_SYNC || "safe";

    if (syncMode === "rebuild") {
      console.log("⚠️ DB_SYNC=rebuild → RECREANDO TODAS LAS TABLAS...");
      await sequelize.sync({ force: true });
      console.log("✅ Todas las tablas fueron recreadas desde cero.");
    } else if (syncMode === "safe") {
      console.log("🔄 DB_SYNC=safe → Sincronización normal sin alterar estructura...");
      await sequelize.sync(); // Seguro y sin cambios destructivos
      console.log("✅ Tablas sincronizadas.");
    } else {
      console.log("🔒 DB_SYNC=none → Producción (sin modificaciones).");
    }

  } catch (error) {
    console.error("❌ Error al conectar la DB:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
