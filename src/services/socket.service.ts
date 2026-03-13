import { getIO } from "../modules/websocket/socket.manager";
import { SOCKET_EVENTS } from "../modules/websocket/socket.events";

export const emitNewMessage = (conversationId: string, message: any) => {
  getIO()
    .to(`conversation:${conversationId}`)
    .emit(SOCKET_EVENTS.MESSAGE_NEW, message);
};

export const emitUpdatedMessage = (conversationId: string, message: any) => {
  getIO()
    .to(`conversation:${conversationId}`)
    .emit(SOCKET_EVENTS.MESSAGE_UPDATED, message);
};

export const emitDeletedMessage = (
  conversationId: string,
  messageId: string
) => {
  getIO()
    .to(`conversation:${conversationId}`)
    .emit(SOCKET_EVENTS.MESSAGE_DELETED, { messageId, conversationId });
};
