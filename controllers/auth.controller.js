const path = require("path");
const testUser = require("../config/testUser");
const {
  COOKIE_NAME,
  COOKIE_VALUE,
  estaAutenticado,
} = require("../middlewares/auth.middleware");

const loginPath = path.join(__dirname, "..", "views", "login.html");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 10 * 60 * 1000,
  path: "/",
};

function mostrarLogin(req, res) {
  if (estaAutenticado(req)) {
    return res.redirect("/home");
  }

  return res.sendFile(loginPath);
}

function validarCredenciales(usuario, password) {
  return usuario === testUser.usuario && password === testUser.password;
}

function procesarLogin(req, res) {
  const usuario = String(req.body.usuario || "").trim();
  const password = String(req.body.password || "").trim();

  if (!usuario || !password) {
    return res.redirect("/login?error=campos");
  }

  if (!validarCredenciales(usuario, password)) {
    return res.redirect("/login?error=credenciales");
  }

  res.cookie(COOKIE_NAME, COOKIE_VALUE, cookieOptions);
  return res.redirect("/home");
}

function cerrarSesion(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res.redirect("/login");
}

module.exports = {
  mostrarLogin,
  procesarLogin,
  cerrarSesion,
};

