import UserRepository from "../repositories/user.repository";
import { LoginDTO, RegisterDTO, UpdateProfileDTO } from "../types/auth.types";
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
    sendVerificationEmail(registerData.email, verificationToken);
    const { password, verificationToken: token, ...safeUser } = user;
    return {
      success: true,
      message: "Usuario registrado. Revisa tu email para verificar tu cuenta.",
      user: safeUser,
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
    const { password, ...safeUser } = user;
    return {
      success: true,
      message: "Login exitoso",
      user: safeUser,
      token,
    };
  }

  static async verifyEmail(token: string) {
    if (!token) throw new Error("Missing token");

    const user = await UserRepository.findByVerificationToken(token);
    if (!user) throw new Error("Invalid token");
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    const { password, ...safeUser } = user.toObject();

    return {
      success: true,
      message: "Tu cuenta ha sido verificada. Ahora puedes iniciar sesión.",
      user: safeUser,
    };
  }

  static async updateProfile(userId: string, updateData: UpdateProfileDTO) {
    if (!updateData.name && !updateData.avatar) {
      throw new Error("No data provided for update");
    }
    const updatedUser = await UserRepository.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return {
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    };
  }
}

export default AuthService;
