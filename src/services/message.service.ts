import mongoose from "mongoose";
import MessageRepository from "../repositories/message.repository";
import { IMessage, SendMessageDTO } from "../types";
import ConversationRepository from "../repositories/conversation.repository";

class MessageService {
  static async sendMessage(userId: string, dto: SendMessageDTO) {
    if (!userId || !dto.conversationId || !dto.content) {
      throw new Error("Missing required fields");
    }
    const conversation = await ConversationRepository.findConversationById(
      dto.conversationId
    );
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const isParticipant = conversation.participants.some(
      (participant: any) => participant._id.toString() === userId
    );
    if (!isParticipant) {
      throw new Error("You are not a participant of this conversation");
    }
    const message = await MessageRepository.createMessage({
      conversationId: dto.conversationId,
      senderId: userId,
      content: dto.content,
    });
    if (!message) {
      throw new Error("Error creating message");
    }
    await ConversationRepository.updateLastMessage(dto.conversationId, message);
    return message;
  }

  static async findMessageById(id: mongoose.Types.ObjectId) {
    if (!id) {
      throw new Error("Missing messageId");
    }
    const message = await MessageRepository.findMessageById(id);
    if (!message) {
      throw new Error("Message not found");
    }
    return message;
  }

  static async findAllMessagesByConversation(
    conversationId: string,
    userId: string
  ) {
    if (!conversationId) {
      throw new Error("Missing conversationId");
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
      throw new Error("Message content cannot be empty");
    }
    if (content.length > 5000) {
      throw new Error("Message content is too long");
    }
    const ObjectMessageId = new mongoose.Types.ObjectId(messageId);
    const message = await MessageRepository.findMessageById(ObjectMessageId);
    if (!message) {
      throw new Error("Message not found");
    }
    const senderId =
      typeof message.senderId === "object" &&
      message.senderId !== null &&
      "_id" in message.senderId
        ? message.senderId._id
        : message.senderId;
    if (senderId.toString() !== userId) {
      throw new Error("You can only edit your own messages");
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
      throw new Error("Missing required fields");
    }
    const messageObjectId = new mongoose.Types.ObjectId(messageId);
    const message = await MessageRepository.findMessageById(messageObjectId);
    if (!message) {
      throw new Error("Message not found");
    }
    const senderId =
      typeof message.senderId === "object" &&
      message.senderId !== null &&
      "_id" in message.senderId
        ? message.senderId._id
        : message.senderId;
    if (senderId.toString() !== userId) {
      throw new Error("You can only delete your own messages");
    }
    const messageDeleted = await MessageRepository.deleteMessage(
      messageObjectId
    );
    return messageDeleted;
  }
}

export default MessageService;
