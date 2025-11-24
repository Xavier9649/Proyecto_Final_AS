const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const proyectoRoutes = require("./routes/proyectos.routes");
const auditoriaRoutes = require("./routes/auditoria.routes");
const cotizacionRoutes = require("./routes/cotizaciones.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

/* ---------------------------------
   🔧 1. MIDDLEWARES BASE
   (DEBEN IR PRIMERO)
-----------------------------------*/
app.use(express.json()); // <-- ESTE ES EL CRÍTICO
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(morgan("dev"));

/* ---------------------------------
   🔧 2. SERVIR ARCHIVOS ESTÁTICOS
-----------------------------------*/
app.use("/uploads", (req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cross-Origin-Resource-Policy": "cross-origin",
  });
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* ---------------------------------
   🔧 3. RUTAS DE API
-----------------------------------*/
app.get("/", (req, res) => {
  res.json({ message: "API RemodelPro funcionando 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/auditorias", auditoriaRoutes);
app.use("/api/quotations", cotizacionRoutes);
app.use("/api/users", userRoutes); // <-- AQUÍ SE USA TU RUTA USERS

module.exports = app;


