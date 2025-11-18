// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "clave_super_segura_debes_cambiarla"; 

/**
 * Middleware para verificar la validez del token JWT.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "Acceso denegado. Token requerido." });
  }

  const token = authHeader.split(" ")[1]; // Espera formato "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adjunta el payload (id, rol, email) al request
    next();
  } catch (err) {
    // Error si el token es inválido o expiró
    return res.status(403).json({ error: "Token no válido o expirado." });
  }
};

/**
 * Función que devuelve un middleware para verificar el rol del usuario.
 * @param {Array<string>} rolesPermitidos - Lista de roles (ej: ['ADMIN', 'ARCHITECT'])
 */
const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // Verifica que el usuario fue autenticado por verifyToken
    if (!req.user || !req.user.rol) {
      return res.status(401).json({ error: "Usuario no autenticado o rol no definido." });
    }

    // Verifica si el rol del usuario está en la lista de permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado: rol insuficiente." });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };