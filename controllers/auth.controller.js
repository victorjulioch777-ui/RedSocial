const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { normalizeUsername } = require("../models/User");

const path = require("path");
const {
  COOKIE_NAME,
  COOKIE_VALUE,
  estaAutenticado,
} = require("../middlewares/auth.middleware");

const loginPath = path.join(__dirname, "..", "views", "login.html");

const registerPath = path.join(__dirname, "..", "views", "register.html");

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

async function procesarLogin(req, res) {
  try {
    const usuario = String(req.body.usuario || "").trim();
    const password = String(req.body.password || "");

    if (!usuario || !password) {
      return res.redirect("/login?error=campos");
    }

    const normalizedUsername = normalizeUsername(usuario);

    const user = await User.findOne({
      normalizedUsername,
    }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res.redirect("/login?error=credenciales");
    }

    const passwordCorrecta = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrecta) {
      return res.redirect("/login?error=credenciales");
    }

    res.cookie(COOKIE_NAME, COOKIE_VALUE, cookieOptions);

    return res.redirect("/home");
  } catch (error) {
    console.error("Error iniciando sesión:", error);

    return res.status(500).send("No se pudo iniciar sesión.");
  }
}

function cerrarSesion(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res.redirect("/login");
}

function mostrarRegistro(req, res) {
  if (estaAutenticado(req)) {
    return res.redirect("/home");
  }

  return res.sendFile(registerPath);
}

async function procesarRegistro(req, res) {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      return res.redirect("/register?error=campos");
    }

    if (username.length > 80) {
      return res.redirect("/register?error=campos");
    }

    if (password.length < 6) {
      return res.redirect("/register?error=password");
    }

    const normalizedUsername = normalizeUsername(username);

    const existingUser = await User.findOne({
      normalizedUsername,
    });

    if (existingUser) {
      return res.redirect("/register?error=existe");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      username,
      normalizedUsername,
      passwordHash,
    });

    return res.redirect("/login?registered=1");
  } catch (error) {
    console.error("Error registrando usuario:", error);

    return res.status(500).send("No se pudo crear la cuenta.");
  }
}

module.exports = {
  mostrarLogin,
  procesarLogin,
  cerrarSesion,
  mostrarRegistro,
  procesarRegistro,
};
