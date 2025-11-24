const express = require("express");
const router = express.Router();
const { updateUser } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.put("/:id", verifyToken, updateUser);

module.exports = router;
