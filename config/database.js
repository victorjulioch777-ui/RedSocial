const mongoose = require("mongoose");

async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("No se encontró MONGO_URI. Revisa el archivo .env");
  }

  await mongoose.connect(mongoURI);

  console.log("MongoDB conectado correctamente");
  console.log(`Base de datos: ${mongoose.connection.name}`);
}

module.exports = connectDB;
