import express from "express";
import AuthController from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
} from "../middleware/validator.middleware";
import authMiddleware from "../middleware/auth.middleware";
import authenticate from "../middleware/auth.middleware";

const authRoutes: express.Router = express.Router();

authRoutes.post("/register", validateRegister, AuthController.register);

authRoutes.get("/verify-email/:verification_token", AuthController.verifyEmail);

authRoutes.post("/login", validateLogin, AuthController.login);

authRoutes.get("/profile", authMiddleware, AuthController.getProfile);

authRoutes.put(
  "/profile",
  authenticate,
  validateUpdateProfile,
  AuthController.updateProfile
);

export default authRoutes;
