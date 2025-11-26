import mongoose from "mongoose";
import ConversationRepository from "../repositories/conversation.repository";
import {
  ConversationListItem,
  CreateConversationDTO,
  IConversation,
  IConversationPopulated,
  IMessage,
  IUser,
} from "../types";
import UserRepository from "../repositories/user.repository";
import MessageRepository from "../repositories/message.repository";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/appError.util";

class ConversationService {
  static async createConversation(
    currentUserId: mongoose.Types.ObjectId | string,
    conversationData: CreateConversationDTO
  ) {
    if (!currentUserId || !conversationData.participantId) {
      throw new BadRequestError("Missing required fields");
    }
    if (currentUserId === conversationData.participantId) {
      throw new ConflictError("Cannot create conversation with yourself");
    }
    const participant = await UserRepository.findUserById(
      conversationData.participantId as mongoose.Types.ObjectId
    );
    if (!participant) {
      throw new NotFoundError("Participant not found");
    }
    const conversation =
      await ConversationRepository.findConversationByParticipants(
        currentUserId as mongoose.Types.ObjectId,
        conversationData.participantId as mongoose.Types.ObjectId
      );
    if (conversation) {
      throw new ConflictError("Conversation already exists");
    }
    const conversationDataToCreate: IConversation = {
      name: conversationData.name,
      participants: [
        currentUserId as mongoose.Types.ObjectId,
        conversationData.participantId as mongoose.Types.ObjectId,
      ],
    };
    const newConversation = await ConversationRepository.createConversation(
      conversationDataToCreate
    );
    if (!newConversation) {
      throw new InternalServerError("Error creating conversation");
    }
    return newConversation;
  }

  static async findConversationById(id: mongoose.Types.ObjectId) {
    if (!id) {
      throw new BadRequestError("Missing conversationId");
    }
    const conversation = await ConversationRepository.findConversationById(
      id as mongoose.Types.ObjectId
    );
    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }
    return conversation;
  }

  static async findAllConversationsByUser(userId: mongoose.Types.ObjectId) {
    if (!userId) {
      throw new BadRequestError("Missing userId");
    }
    const conversations: IConversationPopulated[] =
      await ConversationRepository.findAllConversationsByUser(
        userId as mongoose.Types.ObjectId
      );
    if (!conversations || conversations.length === 0) {
      return [];
    }
    const formattedConversations: ConversationListItem[] = conversations.map(
      (conv) => {
        const otherUser = conv.participants.find(
          (participant: IUser) =>
            participant._id?.toString() !== userId.toString()
        );
        if (!otherUser) {
          throw new NotFoundError(
            "Other user not found in conversation participants"
          );
        }
        return {
          _id: conv._id || "",
          otherUser: otherUser,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
        };
      }
    );
    return formattedConversations;
  }

  static async findConversationByParticipants(
    participantId1: mongoose.Types.ObjectId,
    participantId2: mongoose.Types.ObjectId
  ) {
    if (!participantId1 || !participantId2) {
      throw new BadRequestError("Missing participantId");
    }
    const conversation =
      await ConversationRepository.findConversationByParticipants(
        participantId1,
        participantId2
      );
    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }
    return conversation;
  }

  static async updateLastMessage(
    conversationId: mongoose.Types.ObjectId,
    message: IMessage
  ) {
    if (!conversationId || !message) {
      throw new BadRequestError("Missing required fields");
    }
    const conversation = await ConversationRepository.updateLastMessage(
      conversationId,
      message
    );
    if (!conversation) {
      throw new InternalServerError("Error updating conversation");
    }
    return conversation;
  }

  static async deleteConversation(conversationId: mongoose.Types.ObjectId) {
    if (!conversationId) {
      throw new BadRequestError("Missing conversationId");
    }
    await MessageRepository.deleteMessagesByConversation(conversationId);
    const conversation = await ConversationRepository.deleteConversation(
      conversationId
    );
    if (!conversation) {
      throw new InternalServerError("Error deleting conversation");
    }
    return conversation;
  }
}

export default ConversationService;
