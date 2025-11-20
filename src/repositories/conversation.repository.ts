import mongoose from "mongoose";
import Conversations from "../models/Conversation.model";
import {
  IConversation,
  IConversationPopulated,
  IMessage,
  IUser,
} from "../types";

class ConversationRepository {
  static async createConversation(conversationData: IConversation) {
    try {
      return (await Conversations.create(conversationData)).populate(
        "participants"
      );
    } catch (error) {
      console.error("[SERVER ERROR]: no se pudo crear la conversación", error);
      throw error;
    }
  }

  static async findConversationById(id: mongoose.Types.ObjectId) {
    try {
      return await Conversations.findById(id).populate("participants");
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo encontrar la conversación",
        error
      );
      throw error;
    }
  }

  static async findConversationByParticipants(
    participantId1: mongoose.Types.ObjectId,
    participantId2: mongoose.Types.ObjectId
  ) {
    try {
      return await Conversations.findOne({
        $or: [
          { participants: participantId1 },
          { participants: participantId2 },
        ],
      }).populate("participants");
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo encontrar la conversación",
        error
      );
      throw error;
    }
  }

  static async updateConversation(
    id: mongoose.Types.ObjectId,
    conversationData: IConversation
  ) {
    try {
      return await Conversations.findOneAndUpdate(
        { _id: id },
        { $set: conversationData },
        { new: true }
      );
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo actualizar la conversación",
        error
      );
      throw error;
    }
  }

  static async deleteConversation(id: mongoose.Types.ObjectId) {
    try {
      return await Conversations.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo eliminar la conversación",
        error
      );
      throw error;
    }
  }

  static async findAllConversationsByUser(
    userId: mongoose.Types.ObjectId
  ): Promise<IConversationPopulated[]> {
    try {
      const conversations = await Conversations.find({ participants: userId })
        .sort({ lastMessageAt: -1 })
        .populate("participants");
      return conversations.map((conv: any) => ({
        ...conv,
        participants: conv.participants as IUser[],
      })) as IConversationPopulated[];
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo encontrar todas las conversaciones",
        error
      );
      throw error;
    }
  }

  static async findAllConversations() {
    try {
      return await Conversations.find().sort({
        created_at: -1,
      });
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo encontrar todas las conversaciones",
        error
      );
      throw error;
    }
  }

  static async updateLastMessage(
    conversationId: mongoose.Types.ObjectId,
    message: IMessage
  ) {
    try {
      return await Conversations.findByIdAndUpdate(
        conversationId,
        {
          $set: {
            lastMessage: message.content,
            lastMessageAt: message.created_at,
          },
        },
        { new: true }
      );
    } catch (error) {
      console.error(
        "[SERVER ERROR]: no se pudo actualizar la conversación",
        error
      );
      throw error;
    }
  }
}

export default ConversationRepository;
