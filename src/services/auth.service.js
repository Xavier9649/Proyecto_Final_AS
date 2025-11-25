const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const Usuario = require('../models/Usuario'); 
const crypto = require('crypto'); // Módulo nativo para generar tokens
const sendEmail = require('../utils/email'); // Utilidad para enviar correos
const { Op } = require('sequelize'); // Operadores de Sequelize

// --- Funciones existentes (Registro y Login) ---

const register = async ({ nombre, email, password, rol = "CLIENT" }) => {
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) throw new Error("Email ya registrado");

    const passwordHash = await hashPassword(password);

    // Validar roles permitidos
    const rolesPermitidos = ["CLIENT", "ADMIN", "ARCHITECT"];
    if (!rolesPermitidos.includes(rol)) {
        throw new Error("Rol inválido");
    }

    const nuevoUsuario = await Usuario.create({
        nombre,
        email,
        passwordHash,
        rol
    });

    return {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
    };
};


const login = async ({ email, password }) => {
    // Buscamos el usuario incluyendo el passwordHash (que está oculto por defecto)
    const usuario = await Usuario.scope('withHash').findOne({ where: { email } });
    
    if (!usuario) throw new Error("Credenciales inválidas"); 
    
    const valido = await comparePassword(password, usuario.passwordHash);
    if (!valido) throw new Error("Credenciales inválidas");
    
    const token = signToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });
    
    return { 
        token, 
        usuario: { 
            id: usuario.id, 
            nombre: usuario.nombre, 
            email: usuario.email, 
            rol: usuario.rol 
        } 
    };
};

// --- NUEVAS FUNCIONES DE RECUPERACIÓN DE CONTRASEÑA ---

const forgotPassword = async (email) => {
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
        // Por seguridad, no revelamos si el correo existe o no.
        return { message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
    }

    // 1. Generar token aleatorio seguro (hexadecimal)
    const token = crypto.randomBytes(20).toString('hex');

    // 2. Guardar token y fecha de expiración (1 hora = 3600000 ms) en la DB
    usuario.resetPasswordToken = token;
    usuario.resetPasswordExpires = Date.now() + 3600000; 
    await usuario.save();

    // 3. Construir el enlace de recuperación
    // NOTA: Esta URL debe apuntar a tu FRONTEND (React), no al backend.
    // Por ahora usamos https://proyecto-final-as.onrender.com:5173 que es el puerto por defecto de Vite.
    const resetUrl = `https://proyecto-final-as.onrender.com:5173/reset-password/${token}`; 
    
    const message = `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:\n\n${resetUrl}\n\nEste enlace expirará en 1 hora.\nSi no solicitaste esto, ignora este correo.`;

    // 4. Enviar el correo
    await sendEmail(usuario.email, 'Recuperación de Contraseña - RemodelPro', message);

    return { message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' };
};

const resetPassword = async (token, newPassword) => {
    // 1. Buscar usuario que tenga ese token Y que el token no haya expirado
    const usuario = await Usuario.scope('withResetToken').findOne({ 
        where: { 
            resetPasswordToken: token,
            resetPasswordExpires: { [Op.gt]: Date.now() } // Op.gt = Greater Than (Mayor que ahora)
        } 
    });

    if (!usuario) {
        throw new Error('El token es inválido o ha expirado');
    }

    // 2. Actualizar contraseña (hasheada) y limpiar los campos de recuperación
    usuario.passwordHash = await hashPassword(newPassword);
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    await usuario.save();

    return { message: 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.' };
};

module.exports = { 
    register, 
    login, 
    forgotPassword, 
    resetPassword 
};