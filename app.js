require("dotenv").config();

const express = require("express");
const path = require("path");
const net = require("net");
const chalk = require("chalk");
const emoji = require("node-emoji");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const pageRoutes = require("./routes/page.routes");

const app = express();

const PORT = Number(process.argv[2] || process.env.PORT || 5000);
const HOST = process.env.HOST || "127.0.0.1";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/video", express.static(path.join(__dirname, "video")));

app.use(authRoutes);

app.use(postRoutes);
app.use(pageRoutes);

function mostrarPuertoOcupado() {
  console.error(chalk.red(`El puerto ${PORT} ya está en uso.`));

  console.error(
    chalk.yellow(
      "Cierra Go Live en ese puerto o usa otro, por ejemplo: node app.js 4000",
    ),
  );
}

async function iniciarServidor() {
  try {
    await connectDB();

    const server = app.listen(PORT, HOST, () => {
      console.log(
        chalk
          .bgHex("#ff69b4")
          .white.bold(` ${emoji.get("rocket")} NEXIO SERVER STARTED `),
      );

      console.log(
        chalk.green("MongoDB: ") + chalk.cyan("conectado correctamente"),
      );

      console.log(
        chalk.green("Running at: ") + chalk.cyan(`http://localhost:${PORT}`),
      );

      console.log(
        chalk.green("Crear post: ") +
          chalk.cyan(`http://localhost:${PORT}/write`),
      );

      console.log(
        chalk.green("Ver posts: ") +
          chalk.cyan(`http://localhost:${PORT}/posts`),
      );

      console.log(chalk.gray("Press Ctrl+C to stop the server."));
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        mostrarPuertoOcupado();
        process.exit(1);
      }

      console.error("Error del servidor:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error(chalk.red("No se pudo conectar Nexio con MongoDB."));

    console.error(chalk.yellow(error.message));

    process.exit(1);
  }
}

function validarPuertoDisponible() {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    console.error(chalk.red(`El puerto "${PORT}" no es válido.`));

    process.exit(1);
  }

  const prueba = net.createServer();

  prueba.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      mostrarPuertoOcupado();
      process.exit(1);
    }

    console.error("Error comprobando el puerto:", error);
    process.exit(1);
  });

  prueba.once("listening", () => {
    prueba.close(() => {
      iniciarServidor();
    });
  });

  prueba.listen(PORT, HOST);
}

validarPuertoDisponible();
