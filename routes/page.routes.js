const express = require("express");
const path = require("path");
const {
  estaAutenticado,
  protegerRuta,
} = require("../middlewares/auth.middleware");

const router = express.Router();
const viewsPath = path.join(__dirname, "..", "views");

function viewPath(fileName) {
  return path.join(viewsPath, fileName);
}

router.get("/", (req, res) => {
  if (estaAutenticado(req)) {
    return res.redirect("/home");
  }

  return res.redirect("/login");
});

router.get("/home", protegerRuta, (req, res) => {
  res.sendFile(viewPath("index.html"));
});

router.get("/write", protegerRuta, (req, res) => {
  res.sendFile(viewPath("write.html"));
});

router.get("/posts", protegerRuta, (req, res) => {
  res.sendFile(viewPath("posts.html"));
});

module.exports = router;

