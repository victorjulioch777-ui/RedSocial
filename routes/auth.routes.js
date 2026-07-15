const express = require("express");
const {
  cerrarSesion,
  mostrarLogin,
  procesarLogin,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);
router.get("/logout", cerrarSesion);

module.exports = router;

