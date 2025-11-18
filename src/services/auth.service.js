// src/services/auth.service.js
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const Usuario = require('../models/Usuario'); 

const register = async ({ nombre, email, password }) => {
    // 1. Verificar existencia
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
        throw new Error("Email ya registrado");
    }

    // 2. Hashing y Rol por defecto
    const passwordHash = await hashPassword(password);
    const rol = 'CLIENT'; // Registro público siempre es CLIENT

    // 3. Crear usuario
    const nuevoUsuario = await Usuario.create({ 
        nombre, 
        email, 
        passwordHash, 
        rol
    });
    
    // Devolver objeto limpio (el defaultScope excluye passwordHash)
    return { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol };
};

const login = async ({ email, password }) => {
    // 1. Buscar usuario, incluyendo el hash de la contraseña para poder compararla
    const usuario = await Usuario.scope('withHash').findOne({ where: { email } });
    if (!usuario) {
        throw new Error("Credenciales inválidas"); 
    }

    // 2. Comparar contraseña
    const valido = await comparePassword(password, usuario.passwordHash);
    if (!valido) {
        throw new Error("Credenciales inválidas");
    }

    // 3. Generar Token
    const token = signToken({ 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol 
    });

    // 4. Devolver datos sin el hash de la contraseña
    return { 
        token, 
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } 
    };
};

module.exports = { register, login };