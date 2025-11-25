const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require('path'); 

// --- Importación de Rutas ---
const authRoutes = require("./routes/auth.routes");
const proyectoRoutes = require("./routes/proyectos.routes");
const auditoriaRoutes = require("./routes/auditoria.routes"); 
const cotizacionRoutes = require("./routes/cotizacion.routes"); // ✅ RUTA ACTIVADA

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Permitimos explícitamente el origen de nuestro Frontend (Vite)
// y habilitamos credentials para que las cookies/tokens pasen correctamente.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, 
}));

// --- Middlewares de Seguridad y Logs ---
app.use(express.json()); // Middleware para parsear bodies JSON
app.use(helmet()); // Ayuda a asegurar la aplicación con headers HTTP
app.use(morgan("dev")); // Log de peticiones en la consola

// --- Configuración de Archivos Estáticos (Imágenes) ---
// Permite acceder a las imágenes en https://proyecto-final-as.onrender.com:4000/uploads/nombre_imagen.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Rutas de la API ---

// Ruta de prueba base
app.get("/", (req, res) => res.json({ message: "API RemodelPro funcionando 🚀" }));

// Montaje de rutas principales
app.use("/api/auth", authRoutes); 
app.use("/api/proyectos", proyectoRoutes); 
app.use("/api/auditorias", auditoriaRoutes); 

// 🚨 IMPORTANTE: Esta ruta debe coincidir con lo que llama el Frontend en quotationService.js
// Si en el front llamas a '/quotations', aquí debe ser '/api/quotations'
app.use("/api/quotations", cotizacionRoutes); 

module.exports = app;