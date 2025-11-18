// src/controllers/auth.controller.js
const { register, login } = require("../services/auth.service");

const handleRegister = async (req, res) => {
  try {
    // Aquí se debería añadir validación (ej. Joi o Express Validator)
    const user = await register(req.body);
    res.status(201).json({ message: "Registro exitoso", user });
  } catch (err) {
    // Manejo de errores específicos (ej. email ya registrado)
    res.status(400).json({ error: err.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (err) {
    // Error de credenciales inválidas (debe ser 401 Unauthorized)
    res.status(401).json({ error: err.message });
  }
};

module.exports = { handleRegister, handleLogin };