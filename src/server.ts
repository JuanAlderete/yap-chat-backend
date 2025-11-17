// Importaciones
import express from "express";
import cors from "cors";
import envConfig from "./config/env";
import { connectDB } from "./config/db";

// Configuración de Express
const app = express();

app.use(express.json());
app.use(cors());

app.listen(envConfig.port, () => {
  console.log(`Servidor corriendo en http://localhost:${envConfig.port}`);
});

// Middlewares

// Rutas de prueba
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// Conexión a DB e inicio del servidor
//connectDB();
