// src/utils/jwt.js
const jwt = require("jsonwebtoken");
// Usa la clave secreta del .env
const JWT_SECRET = process.env.JWT_SECRET || "clave_super_segura_debes_cambiarla"; 

/**
 * Genera un JWT.
 * @param {object} payload - Datos a incluir (e.g., id, email, rol).
 * @returns {string} El token JWT.
 */
const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // Expira en 1 día
};

module.exports = { signToken };