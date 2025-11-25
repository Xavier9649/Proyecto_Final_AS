// src/server.js (Añadir la línea de importación)
require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db.config");
const models = require('./models/associations'); // <-- ¡IMPORTAR ESTA LÍNEA!

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🌍 Servidor corriendo en https://proyecto-final-as.onrender.com:${PORT}`);
    });
}).catch(err => {
    console.error("No se pudo iniciar el servidor:", err);
});