import request from "supertest";
import express from "express";
import AuthController from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validator.middleware";
import { errorHandler } from "../middleware/error.middleware";
import AuthService from "../services/auth.service";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/appError.util";

// Mock socket.manager so socket.service.ts doesn't try to initialize Socket.io
jest.mock("../modules/websocket/socket.manager", () => ({
  getIO: jest.fn().mockReturnValue({
    to: jest.fn().mockReturnValue({ emit: jest.fn() }),
  }),
}));

// Mock AuthService to avoid real DB interactions
jest.mock("../services/auth.service");

const MockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

// Build a minimal express app for testing
const app = express();
app.use(express.json());

app.post("/api/auth/register", validateRegister, AuthController.register);
app.post("/api/auth/login", validateLogin, AuthController.login);
app.use(errorHandler);

const mockUser = {
  _id: "64f1b2c3d4e5f6a7b8c9d0e1",
  name: "Test User",
  email: "test@example.com",
  isVerified: true,
  created_at: new Date(),
};

describe("POST /api/auth/register", () => {
  it("debería crear un usuario y retornar 201", async () => {
    MockedAuthService.register.mockResolvedValue({
      success: true,
      message: "Usuario registrado. Revisa tu email para verificar tu cuenta.",
      user: mockUser as any,
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
  });

  it("debería retornar 409 si el email ya existe", async () => {
    MockedAuthService.register.mockRejectedValue(
      new ConflictError("Email already exists")
    );

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/login", () => {
  it("debería retornar 401 con credenciales incorrectas", async () => {
    MockedAuthService.login.mockRejectedValue(
      new UnauthorizedError("Incorrect password")
    );

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("debería retornar 401 si el email no está verificado", async () => {
    MockedAuthService.login.mockRejectedValue(
      new UnauthorizedError("User not verified")
    );

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
