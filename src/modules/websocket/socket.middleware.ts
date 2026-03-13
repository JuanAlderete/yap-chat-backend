import { Socket } from "socket.io";
import { verifyToken } from "../../utils/jwt.util";
import { AuthenticatedSocket } from "./types/socket.types";

function socketMiddleware(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: no token provided"));
    }

    const user = verifyToken(token);
    if (!user) {
      return next(new Error("Authentication error: invalid token"));
    }

    socket.userId = user.userId;
    socket.email = user.email;
    next();
  } catch (error) {
    next(new Error("Authentication error: invalid token"));
  }
}

export default socketMiddleware;