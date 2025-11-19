import jwt from "jsonwebtoken";
import envConfig from "../config/env";
import { Request, Response, NextFunction } from "express";

// extender para añadir "user"
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({
        success: false,
        message: "No autorizado",
        status: 401,
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return response.status(400).json({
        success: false,
        message: "Formato de token inválido",
        status: 400,
      });
    }

    const token = parts[1];

    const userSessionData = jwt.verify(token, envConfig.jwtSecret);

    request.user = userSessionData;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({
        success: false,
        message: "Token expirado",
        status: 401,
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return response.status(400).json({
        success: false,
        message: "Token inválido",
        status: 400,
      });
    }

    return response.status(500).json({
      success: false,
      message: "Error interno del servidor",
      status: 500,
    });
  }
}

export default authMiddleware;
