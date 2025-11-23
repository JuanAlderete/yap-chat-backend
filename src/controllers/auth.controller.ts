import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import envConfig from "../config/env";

class AuthController {
  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const userData = await AuthService.register(request.body);
      if (userData.success && userData.user) {
        return response.status(201).json(userData);
        response.redirect(envConfig.frontendUrl + "/login?from=verified_email");
      } else {
        console.log(response);
        return response.status(500).json({
          success: false,
          message: userData.message,
          status: 500,
        });
      }
    } catch (error: any) {
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const userData = await AuthService.login(request.body);

      return response.status(200).json({
        success: true,
        message: userData.message,
        user: userData.user,
        token: userData.token,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async verifyEmail(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      //el token llega en la url como :verification_token
      const token = request.params.verification_token;
      if (!token) {
        return response.status(400).json({
          success: false,
          message: "Token no encontrado",
          status: 400,
        });
      }
      const userData = await AuthService.verifyEmail(token);
      return response.status(200).json({
        success: true,
        message: userData.message,
        user: userData.user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getProfile(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // obtiene el usuario de req.user
    try {
      const userData = request.user;
      if (!userData) {
        return response.status(401).json({
          success: false,
          message: "No autorizado",
          status: 401,
        });
      }

      return response.status(200).json({
        success: true,
        message: "Usuario obtenido exitosamente",
        user: userData,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateProfile(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const userId = request.user._id;
      const { name, avatar } = request.body;

      const result = await AuthService.updateProfile(userId, { name, avatar });

      response.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}

export default AuthController;
