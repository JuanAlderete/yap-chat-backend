import { JWTPayload } from "../types/auth.types";
import jwt from "jsonwebtoken";
import envConfig from "../config/env";

export function generateToken(payload: JWTPayload): string {
  try {
    const expiresIn = envConfig.jwtExpire
      ? parseInt(envConfig.jwtExpire)
      : 86400;
    const token = jwt.sign(payload, envConfig.jwtSecret, {
      expiresIn,
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return "";
  }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, envConfig.jwtSecret) as JWTPayload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
