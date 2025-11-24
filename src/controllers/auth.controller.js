const { register, login, forgotPassword, resetPassword } = require("../services/auth.service");
const Usuario = require("../models/Usuario");

// ===============================
// AUTH CONTROLLERS
// ===============================

const handleRegister = async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(201).json({ message: "Registro exitoso", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "El email es requerido" });
    }

    const result = await forgotPassword(email);
    res.json(result);

  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ error: "Error del servidor al intentar procesar la solicitud." });
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token y nueva contraseña son requeridos" });
    }

    const result = await resetPassword(token, newPassword);
    res.json(result);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ===============================
// ARCHITECTS CONTROLLER
// ===============================

const getArchitects = async (req, res) => {
  try {
    const architects = await Usuario.findAll({
      where: { rol: "ARCHITECT" },
      attributes: ["id", "nombre", "email", "rol"]
    });

    res.json(architects);
  } catch (error) {
    console.error("Error al obtener arquitectos:", error);
    res.status(500).json({ error: "Error al obtener arquitectos" });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
  getArchitects
};



