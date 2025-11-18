// src/routes/auth.routes.js
const express = require("express");
const { handleRegister, handleLogin } = require("../controllers/auth.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

// Endpoints Públicos
router.post("/register", handleRegister);
router.post("/login", handleLogin);

// Endpoints Protegidos (Para prueba)
router.get("/perfil", verifyToken, (req, res) => {
  // Devuelve los datos del payload del token
  res.json({ message: "Datos del usuario autenticado", user: req.user });
});

router.get("/admin-only", verifyToken, checkRole(['ADMIN']), (req, res) => {
  res.json({ message: "Acceso exclusivo para administradores" });
});

module.exports = router;