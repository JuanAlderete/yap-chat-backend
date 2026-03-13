import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events";

export const registerSocketHandlers = (socket: Socket): void => {
  socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation:${conversationId}`);
  });

  socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} left conversation:${conversationId}`);
  });

  socket.on("typing:start", ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit("typing:start", {
      userId: (socket as any).userId,
      conversationId,
    });
  });

  socket.on("typing:stop", ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit("typing:stop", {
      userId: (socket as any).userId,
      conversationId,
    });
  });
};
