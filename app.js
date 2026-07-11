const express = require("express");
const path = require("path");
const chalk = require("chalk");
const emoji = require("node-emoji");

const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, "public")));

const htmlPath = (fileName) => path.join(__dirname, "public", "html", fileName);

app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(htmlPath("index.html"));
});

app.get(["/write", "/write.html"], (req, res) => {
  res.sendFile(htmlPath("write.html"));
});

app.get(["/posts", "/posts.html"], (req, res) => {
  res.sendFile(htmlPath("posts.html"));
});

app.listen(PORT, () => {
  console.log(
    chalk
      .bgHex("#ff69b4")
      .white.bold(` ${emoji.get("rocket")} EXPRESS SERVER STARTED `),
  );

  console.log(
    chalk.green("Running at: ") + chalk.cyan(`http://localhost:${PORT}`),
  );

  console.log(chalk.gray("Press Ctrl+C to stop the server."));
});
