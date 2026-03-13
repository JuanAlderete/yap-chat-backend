import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import socketMiddleware from "./socket.middleware";
import { registerSocketHandlers } from "./socket.handlers";

let io: SocketIOServer;

export const initSocket = (
  httpServer: HttpServer,
  allowedOrigins: (string | undefined)[]
): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins.filter(Boolean) as string[],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(socketMiddleware);

  // Register event handlers
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);
    registerSocketHandlers(socket);
    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io has not been initialized. Call initSocket first.");
  }
  return io;
};
