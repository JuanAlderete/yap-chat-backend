import express from "express";
import cors from "cors";
import envConfig from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import conversationRoutes from "./routes/conversation.routes";
import messagesRoutes from "./routes/message.routes";

const allowedOrigins = [
  "http://localhost:5173",
  "https://yap-chat-front-bojj7quyt-juanalderetes-projects.vercel.app",
  process.env.FRONTEND_URL,
];

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messagesRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(envConfig.port, () => {
      console.log(
        `🚀 Servidor corriendo en http://localhost:${envConfig.port}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  });
