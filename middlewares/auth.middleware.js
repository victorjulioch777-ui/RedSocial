const COOKIE_NAME = "autenticado";
const COOKIE_VALUE = "true";

function estaAutenticado(req) {
  return req.cookies && req.cookies[COOKIE_NAME] === COOKIE_VALUE;
}

function protegerRuta(req, res, next) {
  if (estaAutenticado(req)) {
    return next();
  }

  return res.redirect("/login");
}

module.exports = {
  COOKIE_NAME,
  COOKIE_VALUE,
  estaAutenticado,
  protegerRuta,
};

