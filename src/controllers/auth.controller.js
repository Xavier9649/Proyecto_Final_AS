const { register, login, forgotPassword, resetPassword } = require("../services/auth.service");

// --- Funciones existentes (Registro y Login) ---

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
    // Usamos 401 para credenciales inválidas
    res.status(401).json({ error: err.message });
  }
};

// --- NUEVAS FUNCIONES DE RECUPERACIÓN DE CONTRASEÑA ---

const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validación simple
        if (!email) {
            return res.status(400).json({ error: "El email es requerido" });
        }
        
        // Llama al servicio para generar token y enviar correo
        const result = await forgotPassword(email);
        
        // Responde con éxito (siempre 200, incluso si el correo no existe, por seguridad)
        res.json(result);
    } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ error: 'Error del servidor al intentar procesar la solicitud.' });
    }
};

const handleResetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        // Validación de entrada
        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token y nueva contraseña son requeridos" });
        }

        // Llama al servicio para actualizar la contraseña
        const result = await resetPassword(token, newPassword);
        res.json(result);
    } catch (error) {
        // Si el servicio falla (token inválido/expirado), devolvemos 400
        res.status(400).json({ error: error.message });
    }
};

module.exports = { 
    handleRegister, 
    handleLogin, 
    handleForgotPassword, // Nueva exportación
    handleResetPassword   // Nueva exportación
};