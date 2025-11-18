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
    });
    if (!user) {
      throw new Error("Error creating user");
    }
    sendVerificationEmail(registerData.email, verificationToken);
    return user;
  }

  static async login(loginData: LoginDTO) {
    if (!loginData.email || !loginData.password) {
      throw new Error("Missing required fields");
    }
    const user = await UserRepository.findUserByEmail(loginData.email);
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
    return { token, user };
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
    return user;
  }
}
