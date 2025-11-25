import mongoose from "mongoose";
import Users from "../models/User.model";
import { IUser } from "../types";

class UserRepository {
  static async createUser(userData: IUser) {
    try {
      return await Users.insertOne(userData);
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo crear el usuario", error);
      throw error;
    }
  }

  static async findUserByEmail(
    email: string,
    includePassword: boolean = false
  ) {
    try {
      let query;
      if (includePassword) {
        query = Users.findOne({ email: email, active: true })
          .select("+password")
          .lean();
      } else {
        query = Users.findOne({ email: email, active: true }).lean();
      }
      return await query;
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo encontrar el usuario", error);
      throw error;
    }
  }

  static async findUserById(id: mongoose.Types.ObjectId) {
    try {
      return await Users.findOne({ _id: id, active: true });
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo encontrar el usuario", error);
      throw error;
    }
  }

  static async updateUser(
    userId: string,
    updateData: { name?: string; avatar?: string }
  ) {
    try {
      return await Users.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo actualizar el usuario", error);
      throw error;
    }
  }

  static async deleteUser(id: mongoose.Types.ObjectId) {
    try {
      return await Users.findOneAndDelete({ _id: id, active: true });
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo eliminar el usuario", error);
      throw error;
    }
  }

  static async findAllUsers() {
    try {
      return await Users.find({ active: true });
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo encontrar todos los usuarios",
        error
      );
      throw error;
    }
  }

  static async findByVerificationToken(token: string) {
    try {
      return await Users.findOne({ verificationToken: token, active: true });
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo encontrar el usuario", error);
      throw error;
    }
  }

  static async searchUsers(query: string, currentUserId: string) {
    try {
      return await Users.find({
        _id: { $ne: currentUserId },
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
        isVerified: true,
      })
        .select("name email avatar")
        .limit(10);
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo encontrar el usuario", error);
      throw error;
    }
  }
}

export default UserRepository;
