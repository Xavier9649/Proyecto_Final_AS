const Usuario = require("../models/Usuario");

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // VALIDAR EMAIL DUPLICADO
    if (email && email !== usuario.email) {
      const duplicado = await Usuario.findOne({ where: { email } });

      if (duplicado) {
        return res.status(400).json({
          error: "El correo ya está registrado por otro usuario",
        });
      }
    }

    usuario.nombre = nombre ?? usuario.nombre;
    usuario.email = email ?? usuario.email;

    await usuario.save();

    res.json({
      message: "Usuario actualizado correctamente",
      usuario,
    });

  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

module.exports = { updateUser };
