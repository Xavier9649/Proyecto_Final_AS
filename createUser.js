// createUser.js
const readline = require("readline");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Importa tu modelo EXACTO
const Usuario = require("./src/models/Usuario");

// Conexión a la BD usando variables del backend
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

// Interfaz para leer datos desde consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Pregunta en consola con Promesa
const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function createUser() {
  try {
    console.log("=== Crear Usuario Manual ===");

    const nombre = await ask("Nombre completo: ");
    const email = await ask("Correo electrónico: ");
    const password = await ask("Contraseña: ");
    const rol = await ask("Rol (ADMIN / ARCHITECT / CLIENT): ");

    if (!["ADMIN", "ARCHITECT", "CLIENT"].includes(rol.toUpperCase())) {
      console.log("❌ Rol no válido. Usa ADMIN, ARCHITECT o CLIENT.");
      rl.close();
      return;
    }

    await sequelize.authenticate();
    console.log("✔ Conexión a la base de datos lista.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Usuario.create({
      nombre,
      email,               // <- CAMPO REAL DE TU BD
      passwordHash: hashedPassword, // <- CAMPO REAL DE TU BD
      rol: rol.toUpperCase(),
    });

    console.log("\n🎉 Usuario creado con éxito:");
    console.log("Nombre:", user.nombre);
    console.log("Correo:", user.email);
    console.log("Rol:", user.rol);
    console.log("ID:", user.id);

    rl.close();
    await sequelize.close();
  } catch (error) {
    console.error("❌ Error al crear usuario:", error.message);
    rl.close();
    await sequelize.close();
  }
}

createUser();
