import mongoose from "mongoose";
import Messages from "../models/Message.model";
import { IMessage } from "../types";

class MessageRepository {
  static async createMessage(messageData: IMessage) {
    try {
      return await Messages.insertOne(messageData);
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo crear el mensaje", error);
      throw error;
    }
  }

  static async findMessageById(id: mongoose.Types.ObjectId) {
    try {
      return await Messages.findById(id).populate("senderId").lean();
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo encontrar el mensaje", error);
      throw error;
    }
  }

  static async findAllMessagesByConversation(
    conversationId: mongoose.Types.ObjectId
  ) {
    try {
      return await Messages.find({ conversationId: conversationId })
        .sort({ created_at: -1 })
        .populate("senderId")
        .lean();
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo encontrar todos los mensajes",
        error
      );
      throw error;
    }
  }

  static async updateMessage(
    id: mongoose.Types.ObjectId,
    messageData: IMessage
  ) {
    try {
      return await Messages.findOneAndUpdate(
        { _id: id },
        { $set: messageData },
        { new: true }
      );
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo actualizar el mensaje", error);
      throw error;
    }
  }

  static async deleteMessage(id: mongoose.Types.ObjectId) {
    try {
      return await Messages.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo eliminar el mensaje", error);
      throw error;
    }
  }

  static async deleteMessagesByConversation(
    conversationId: mongoose.Types.ObjectId
  ) {
    try {
      return await Messages.deleteMany({ conversationId: conversationId });
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo eliminar todos los mensajes de una conversación",
        error
      );
      throw error;
    }
  }

  static async markMessagesAsRead(
    conversationId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ) {
    try {
      return await Messages.updateMany(
        {
          conversationId: conversationId,
          senderId: { $ne: userId },
          isRead: false,
        },
        { $set: { isRead: true } }
      );
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo marcar el mensaje como leido",
        error
      );
      throw error;
    }
  }
}

export default MessageRepository;
