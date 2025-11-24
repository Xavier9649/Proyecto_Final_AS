const express = require("express");
const router = express.Router();

const {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
  getArchitects
} = require("../controllers/auth.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

// Arquitectos (solo admin)
router.get("/architects", verifyToken, getArchitects);

// Registro y login
router.post("/register", handleRegister);
router.post("/login", handleLogin);

// Password recovery
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);

module.exports = router;

