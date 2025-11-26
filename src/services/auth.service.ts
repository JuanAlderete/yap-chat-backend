import UserRepository from "../repositories/user.repository";
import { LoginDTO, RegisterDTO, UpdateProfileDTO } from "../types/auth.types";
import { sendVerificationEmail } from "../utils/email.util";
import { generateToken } from "../utils/jwt.util";
import { generateRandomToken } from "../utils/crypto.util";
import bcrypt from "bcryptjs";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/appError.util";

class AuthService {
  static async register(registerData: RegisterDTO) {
    if (!registerData.name || !registerData.email || !registerData.password) {
      throw new BadRequestError("Missing required fields");
    }
    const hasEmail = await UserRepository.findUserByEmail(registerData.email);
    if (hasEmail) {
      throw new ConflictError("Email already exists");
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
      throw new InternalServerError("Error creating user");
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
      throw new BadRequestError("Missing required fields");
    }
    const user = await UserRepository.findUserByEmail(loginData.email, true);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Incorrect password");
    }
    if (!user.isVerified) {
      throw new UnauthorizedError("User not verified");
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
    if (!token) throw new BadRequestError("Missing token");

    const user = await UserRepository.findByVerificationToken(token);
    if (!user) throw new NotFoundError("Invalid token");
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

  static async updateProfile(userId: string, updated_ata: UpdateProfileDTO) {
    if (!updated_ata.name && !updated_ata.avatar) {
      throw new BadRequestError("No data provided for update");
    }
    const updatedUser = await UserRepository.updateUser(userId, updated_ata);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    return {
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    };
  }

  static async searchUsers(query: string, currentUserId: string) {
    if (!query || query.trim().length < 2) {
      throw new BadRequestError("Query must be at least 2 characters");
    }

    const users = await UserRepository.searchUsers(query.trim(), currentUserId);

    return {
      success: true,
      users,
    };
  }
}

export default AuthService;
