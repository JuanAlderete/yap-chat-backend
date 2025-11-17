require("dotenv").config();
import mongoose from "mongoose";
import envConfig from "./env";

// Conectar a la base de datos
export async function connectDB() {
  try {
    await mongoose.connect(envConfig.dbUri || "");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}
