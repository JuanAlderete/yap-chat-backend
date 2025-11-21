import mongoose from "mongoose";
import MessageService from "../services/message.service";
import { NextFunction, Request, Response } from "express";

class MessageController {
  static async sendMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userId = request.user.userId;
    try {
      const { conversationId, content } = request.body;
      const message = await MessageService.sendMessage(userId, {
        conversationId,
        content,
      });
      response.status(201).json({
        success: true,
        message,
      });
    } catch (error: any) {
      console.error("Error creating message:", error);
      next(error);
    }
  }

  static async getMessagesByConversation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const conversationId = request.params.conversationId;
    const userId = request.user.userId;
    try {
      if (!conversationId) {
        return response.status(400).json({
          success: false,
          message: "Missing conversationId in request parameters.",
        });
      }
      const messages = await MessageService.findAllMessagesByConversation(
        conversationId,
        userId
      );
      return response.status(200).json({
        success: true,
        message: "Messages found successfully",
        messages,
      });
    } catch (error: any) {
      console.error("Error getting messages by conversation:", error);
      next(error);
    }
  }

  static async updateMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const messageId = request.params.id;
    try {
      if (!messageId) {
        return response.status(400).json({
          success: false,
          message: "Missing messageId in request parameters.",
        });
      }
      const messageData = request.body;
      if (!messageData) {
        return response.status(400).json({
          success: false,
          message: "Missing messageData in request body.",
        });
      }
      const messageObjectId = new mongoose.Types.ObjectId(messageId);
      const message = await MessageService.updateMessage(
        messageObjectId,
        messageData
      );
      return response.status(200).json({
        success: true,
        message: "Message updated successfully",
        messageContent: message,
      });
    } catch (error: any) {
      console.error("Error updating message:", error);
      next(error);
    }
  }

  static async deleteMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const messageId = request.params.id;
    const userId = request.user.userId;
    try {
      const message = await MessageService.deleteMessage(messageId, userId);
      return response.status(200).json({
        success: true,
        message: "Message deleted successfully",
        messageContent: message,
      });
    } catch (error: any) {
      console.error("Error deleting message:", error);
      next(error);
    }
  }
}

export default MessageController;
