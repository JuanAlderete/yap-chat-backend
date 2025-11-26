import mongoose from "mongoose";
import MessageRepository from "../repositories/message.repository";
import { IMessage, SendMessageDTO } from "../types";
import ConversationRepository from "../repositories/conversation.repository";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/appError.util";

class MessageService {
  static async sendMessage(userId: string, dto: SendMessageDTO) {
    if (!userId || !dto.conversationId || !dto.content) {
      throw new BadRequestError("Missing required fields");
    }
    const conversation = await ConversationRepository.findConversationById(
      dto.conversationId
    );
    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }
    const isParticipant = conversation.participants.some(
      (participant: any) => participant._id.toString() === userId
    );
    if (!isParticipant) {
      throw new ConflictError("You are not a participant of this conversation");
    }
    const message = await MessageRepository.createMessage({
      conversationId: dto.conversationId,
      senderId: userId,
      content: dto.content,
    });
    if (!message) {
      throw new InternalServerError("Error creating message");
    }
    await ConversationRepository.updateLastMessage(dto.conversationId, message);
    return message;
  }

  static async findMessageById(id: mongoose.Types.ObjectId) {
    if (!id) {
      throw new BadRequestError("Missing messageId");
    }
    const message = await MessageRepository.findMessageById(id);
    if (!message) {
      throw new NotFoundError("Message not found");
    }
    return message;
  }

  static async findAllMessagesByConversation(
    conversationId: string,
    userId: string
  ) {
    if (!conversationId) {
      throw new BadRequestError("Missing conversationId");
    }
    const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
    const messages = await MessageRepository.findAllMessagesByConversation(
      conversationObjectId
    );
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await MessageRepository.markMessagesAsRead(
      conversationObjectId,
      userObjectId
    );
    if (!messages || messages.length === 0) {
      return [];
    }
    return messages;
  }

  static async updateMessage(
    messageId: string,
    userId: string,
    content: string
  ) {
    if (!content || content.trim().length === 0) {
      throw new BadRequestError("Message content cannot be empty");
    }
    if (content.length > 5000) {
      throw new BadRequestError("Message content is too long");
    }
    const ObjectMessageId = new mongoose.Types.ObjectId(messageId);
    const message = await MessageRepository.findMessageById(ObjectMessageId);
    if (!message) {
      throw new NotFoundError("Message not found");
    }
    const senderId =
      typeof message.senderId === "object" &&
      message.senderId !== null &&
      "_id" in message.senderId
        ? message.senderId._id
        : message.senderId;
    if (senderId.toString() !== userId) {
      throw new ConflictError("You can only edit your own messages");
    }
    const updatedMessage = await MessageRepository.updateMessage(
      messageId,
      content.trim()
    );

    return {
      success: true,
      message: updatedMessage,
    };
  }

  static async deleteMessage(messageId: string, userId: string) {
    if (!messageId || !userId) {
      throw new BadRequestError("Missing required fields");
    }
    const messageObjectId = new mongoose.Types.ObjectId(messageId);
    const message = await MessageRepository.findMessageById(messageObjectId);
    if (!message) {
      throw new NotFoundError("Message not found");
    }
    const senderId =
      typeof message.senderId === "object" &&
      message.senderId !== null &&
      "_id" in message.senderId
        ? message.senderId._id
        : message.senderId;
    if (senderId.toString() !== userId) {
      throw new ConflictError("You can only delete your own messages");
    }
    const messageDeleted = await MessageRepository.deleteMessage(
      messageObjectId
    );
    return messageDeleted;
  }
}

export default MessageService;
