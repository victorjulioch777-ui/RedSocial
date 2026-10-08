const express = require("express");

const {
  cerrarSesion,
  mostrarLogin,
  procesarLogin,
  mostrarRegistro,
  procesarRegistro,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);

router.get("/register", mostrarRegistro);
router.post("/register", procesarRegistro);

router.get("/logout", cerrarSesion);

module.exports = router;
