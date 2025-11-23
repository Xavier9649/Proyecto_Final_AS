const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require('path');

const authRoutes = require("./routes/auth.routes");
const proyectoRoutes = require("./routes/proyectos.routes");
const auditoriaRoutes = require("./routes/auditoria.routes");
const cotizacionRoutes = require("./routes/cotizaciones.routes"); // <--- 1. IMPORTAR

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get("/", (req, res) => res.json({ message: "API RemodelPro funcionando 🚀" }));

app.use("/api/auth", authRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/auditorias", auditoriaRoutes);
app.use("/api/quotations", cotizacionRoutes); // <--- 2. MONTAR (Esta línea faltaba)

module.exports = app;