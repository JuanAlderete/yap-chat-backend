// Importaciones
import express from "express";
import cors from "cors";
import envConfig from "./config/env";
import { connectDB } from "./config/db";

// Configuración de Express
const app = express();

app.use(express.json());
app.use(cors());

// Middlewares

// Rutas de prueba
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// Conexión a DB e inicio del servidor
connectDB()
  .then(() => {
    // Luego iniciar el servidor
    app.listen(envConfig.port, () => {
      console.log(
        `🚀 Servidor corriendo en http://localhost:${envConfig.port}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
