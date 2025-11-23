const express = require("express");
const { 
    handleRegister, 
    handleLogin, 
    handleForgotPassword, 
    handleResetPassword 
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// --- Endpoints Públicos ---
router.post("/register", handleRegister);
router.post("/login", handleLogin);

// Recuperación de Contraseña
// 1. Solicitar enlace de recuperación (envía correo con token)
router.post("/forgot-password", handleForgotPassword); 
// 2. Restablecer contraseña (recibe token y nueva contraseña)
router.post("/reset-password", handleResetPassword);   

// --- Endpoints Protegidos ---
// Ejemplo de ruta protegida para obtener datos del perfil
router.get("/perfil", verifyToken, (req, res) => {
  res.json({ message: "Datos del usuario autenticado", user: req.user });
});

module.exports = router;