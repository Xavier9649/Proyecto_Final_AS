// src/utils/password.js
const bcrypt = require("bcrypt");

/**
 * Hashea una contraseña de texto plano.
 * @param {string} plain - Contraseña sin hashear.
 * @returns {Promise<string>} Contraseña hasheada.
 */
const hashPassword = async (plain) => {
  return await bcrypt.hash(plain, 10);
};

/**
 * Compara una contraseña de texto plano con un hash almacenado.
 * @param {string} plain - Contraseña sin hashear.
 * @param {string} hash - Hash almacenado en la DB.
 * @returns {Promise<boolean>} True si coinciden.
 */
const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

module.exports = { hashPassword, comparePassword };