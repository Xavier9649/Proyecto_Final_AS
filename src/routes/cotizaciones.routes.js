const { Router } = require('express');
const router = Router();

// IMPORTACIÓN CORRECTA DEL MIDDLEWARE REAL
const { verifyToken, checkRole, isAdmin } = require("../middlewares/auth.middleware");

// IMPORTACIÓN CORRECTA DE CONTROLADORES
const { 
    handleCreate, 
    handleGetAll, 
    handleAssign, 
    handleUpdateStatus,
    handleDelete
} = require("../controllers/cotizacion.controller");

// 1. Crear Cotización (Cliente logueado)
router.post("/", verifyToken, handleCreate);

// 2. Obtener cotizaciones según el rol
router.get("/", verifyToken, handleGetAll);

// 3. Asignar arquitecto (solo ADMIN)
router.put("/:id/assign", verifyToken, checkRole(["ADMIN"]), handleAssign);

// 4. Actualizar estado de la cotización (solo ARCHITECT)
router.put("/:id/status", verifyToken, checkRole(["ARCHITECT"]), handleUpdateStatus);

// 5. Eliminar cotización (solo ADMIN)
router.delete("/:id", verifyToken, checkRole(["ADMIN"]), handleDelete);

module.exports = router;

