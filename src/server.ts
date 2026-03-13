import express from "express";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import envConfig from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import conversationRoutes from "./routes/conversation.routes";
import messagesRoutes from "./routes/message.routes";
import { generalLimiter } from "./middleware/rateLimit.middleware";
import { initSocket } from "./modules/websocket/socket.manager";

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.0.198:5173", // Añadido para pruebas en red local
  "https://yap-chat-front-bojj7quyt-juanalderetes-projects.vercel.app",
  process.env.FRONTEND_URL,
];

const app = express();

// Security
app.use(helmet());
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

// General rate limiting
app.use(generalLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messagesRoutes);

app.use(errorHandler);

// HTTP Server + Socket.io
const server = http.createServer(app);
initSocket(server, allowedOrigins);

connectDB()
  .then(() => {
    server.listen(envConfig.port, () => {
      console.log(
        `🚀 Servidor corriendo en http://localhost:${envConfig.port}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  });
