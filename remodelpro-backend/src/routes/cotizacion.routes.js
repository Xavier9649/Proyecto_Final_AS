import { Router } from "express";
import { CotizacionController } from "../controllers/cotizacion.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isArchitect } from "../middleware/roles.middleware.js";

const router = Router();

// Cliente crea cotización
router.post("/", auth, CotizacionController.crear);

// Todos ven SUS cotizaciones según rol
router.get("/", auth, CotizacionController.listar);

// Admin asigna arquitecto
router.put("/:id/assign", auth, isAdmin, CotizacionController.asignar);

// Arquitecto actualiza estado
router.put("/:id/update", auth, isArchitect, CotizacionController.actualizarEstado);

export default router;
