export const Cotizacion = sequelize.define("Cotizacion", {
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    estado: {
        type: DataTypes.ENUM("pendiente", "asignada", "completada"),
        defaultValue: "pendiente"
    }
});

