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

  static async findUserByEmail(email: string) {
    try {
      return await Users.findOne({ email: email, active: true });
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

  static async updateUser(id: mongoose.Types.ObjectId, userData: IUser) {
    try {
      return await Users.findOneAndUpdate(
        { _id: id, active: true },
        { $set: userData },
        { new: true }
      );
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
}

export default UserRepository;
