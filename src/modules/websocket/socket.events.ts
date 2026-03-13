export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",
  USER_ACTIVITY: "user:activity",
  JOIN_CONVERSATION: "join:conversation",
  LEAVE_CONVERSATION: "leave:conversation",
  MESSAGE_NEW: "message:new",
  MESSAGE_UPDATED: "message:updated",
  MESSAGE_DELETED: "message:deleted",
} as const;

export type SocketEvent = keyof typeof SOCKET_EVENTS;