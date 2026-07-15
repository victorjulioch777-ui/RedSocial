const express = require("express");
const path = require("path");
const net = require("net");
const chalk = require("chalk");
const emoji = require("node-emoji");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const pageRoutes = require("./routes/page.routes");

const app = express();
const PORT = Number(process.env.PORT || process.argv[2] || 5000);
const HOST = process.env.HOST || "127.0.0.1";

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(authRoutes);
app.use(pageRoutes);

function mostrarPuertoOcupado() {
  console.error(chalk.red("El puerto " + PORT + " ya esta en uso."));
  console.error(
    chalk.yellow(
      "Cierra Go Live en ese puerto o usa otro, por ejemplo: node app.js 4000",
    ),
  );
}

function iniciarServidor() {
  const server = app.listen(PORT, HOST, () => {
    console.log(
      chalk
        .bgHex("#ff69b4")
        .white.bold(" " + emoji.get("rocket") + " EXPRESS SERVER STARTED "),
    );

    console.log(
      chalk.green("Running at: ") + chalk.cyan("http://localhost:" + PORT),
    );
    console.log(chalk.gray("Press Ctrl+C to stop the server."));
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      mostrarPuertoOcupado();
      process.exit(1);
    }

    throw error;
  });
}

function validarPuertoDisponible() {
  const prueba = net.createServer();

  prueba.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      mostrarPuertoOcupado();
      process.exit(1);
    }

    throw error;
  });

  prueba.once("listening", () => {
    prueba.close(iniciarServidor);
  });

  prueba.listen(PORT, HOST);
}

validarPuertoDisponible();
