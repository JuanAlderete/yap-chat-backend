import UserRepository from "../repositories/user.repository";
import { LoginDTO, RegisterDTO } from "../types/auth.types";
import { sendVerificationEmail } from "../utils/email.util";
import { generateToken } from "../utils/jwt.util";
import { generateRandomToken } from "../utils/crypto.util";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

class AuthService {
  static async register(registerData: RegisterDTO) {
    if (!registerData.name || !registerData.email || !registerData.password) {
      throw new Error("Missing required fields");
    }
    const hasEmail = await UserRepository.findUserByEmail(registerData.email);
    if (hasEmail) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(registerData.password, 12);
    const verificationToken = generateRandomToken();
    const user = await UserRepository.createUser({
      name: registerData.name,
      email: registerData.email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: verificationToken,
      active: true,
      created_at: new Date(),
    });
    if (!user) {
      throw new Error("Error creating user");
    }
    delete user.verificationToken;
    sendVerificationEmail(registerData.email, verificationToken);
    return {
      success: true,
      message: "Usuario registrado. Revisa tu email para verificar tu cuenta.",
      user: user,
    };
  }

  static async login(loginData: LoginDTO) {
    if (!loginData.email || !loginData.password) {
      throw new Error("Missing required fields");
    }
    const user = await UserRepository.findUserByEmail(loginData.email, true);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }
    if (!user.isVerified) {
      throw new Error("User not verified");
    }
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });
    return {
      success: true,
      user: user,
      token,
    };
  }

  static async verifyEmail(token: string) {
    if (!token) {
      throw new Error("Missing token");
    }
    const user = await UserRepository.findByVerificationToken(token);
    if (!user) {
      throw new Error("Invalid token");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await UserRepository.updateUser(user._id as mongoose.Types.ObjectId, user);
    return {
      success: true,
      message: "Tu cuenta ha sido verificada. Ahora puedes iniciar sesión.",
      user: user,
    };
  }
}

export default AuthService;
