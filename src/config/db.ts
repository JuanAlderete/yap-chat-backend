import mongoose from "mongoose";
import envConfig from "./env";

// Conectar a la base de datos
export async function connectDB() {
  try {
    await mongoose.connect(envConfig.dbUri || "", {
      timeoutMS: 60000,
      socketTimeoutMS: 60000,
    });
    console.log("✅ MongoDB conectado exitosamente");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
}
