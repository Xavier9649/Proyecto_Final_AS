const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require('path'); // Módulo de Node.js para manejar rutas

// --- Importación de Rutas ---
const authRoutes = require("./routes/auth.routes");
const proyectoRoutes = require("./routes/proyectos.routes");
const auditoriaRoutes = require("./routes/auditoria.routes"); // <-- 1. IMPORTAR RUTAS NUEVAS

const app = express();

// --- Middlewares de Seguridad y Logs ---
app.use(express.json()); // Middleware para parsear bodies JSON (necesario para POST/PUT)
app.use(cors()); // Permite peticiones de otros dominios (Frontend)
app.use(helmet()); // Ayuda a asegurar la aplicación configurando varios headers HTTP
app.use(morgan("dev")); // Log de peticiones en la consola

// --- Configuración de Archivos Estáticos (Imágenes) ---
// Expone la carpeta 'uploads' para que las imágenes subidas sean accesibles 
// a través de http://localhost:4000/uploads/...
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Rutas de la API ---

// Ruta de prueba
app.get("/", (req, res) => res.json({ message: "API RemodelPro funcionando 🚀" }));

// Montaje de rutas
app.use("/api/auth", authRoutes); // /api/auth/register, /api/auth/login
app.use("/api/proyectos", proyectoRoutes); // /api/proyectos, /api/proyectos/:id
app.use("/api/auditorias", auditoriaRoutes); // <-- 2. MONTAR RUTAS NUEVAS

module.exports = app;