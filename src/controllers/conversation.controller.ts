import { NextFunction, Request, Response } from "express";
import ConversationService from "../services/conversation.service";
import mongoose from "mongoose";

class ConversationController {
  static async createConversation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const userData = request.user;
      if (!userData) {
        return response.status(401).json({
          success: false,
          message: "No autorizado",
          status: 401,
        });
      }
      const conversationData = request.body;
      if (!conversationData.participantId) {
        return response.status(400).json({
          success: false,
          message: "Missing required fields",
          status: 400,
        });
      }
      const newConversation = await ConversationService.createConversation(
        userData.userId,
        conversationData
      );
      return response.json(newConversation);
    } catch (error: any) {
      next(error);
    }
  }

  static async getMyConversations(request: Request, response: Response) {
    try {
      const userData = request.user;
      if (!userData) {
        return response.status(401).json({
          success: false,
          message: "No autorizado",
          status: 401,
        });
      }
      const conversations =
        await ConversationService.findAllConversationsByUser(userData.userId);
      return response.status(200).json({
        success: true,
        message: "Conversations found successfully",
        conversations,
      });
    } catch (error: any) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({
          success: false,
          message: error.message,
          status: error.status,
        });
      }

      return response.status(500).json({
        success: false,
        message: "Error interno del servidor",
        status: 500,
      });
    }
  }

  static async getConversationById(request: Request, response: Response) {
    const conversationId = request.params.id;
    try {
      if (!conversationId) {
        return response.status(400).json({
          success: false,
          message: "Missing conversationId in request parameters.",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return response.status(400).json({
          success: false,
          message: "Invalid conversationId format.",
        });
      }
      const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
      const conversation = await ConversationService.findConversationById(
        conversationObjectId
      );
      if (!conversation) {
        return response.status(404).json({
          success: false,
          message: `Conversation with ID ${conversationId} not found.`,
        });
      }
      return response.status(200).json({
        success: true,
        message: "Conversation found successfully",
        conversation: conversation,
      });
    } catch (error) {
      const customError = error as { status?: number; message: string };

      if (customError.status) {
        return response.status(customError.status).json({
          success: false,
          message: customError.message,
        });
      }
      console.error("Server Error in getConversationById:", error);
      return response.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  static async deleteConversation(request: Request, response: Response) {
    const conversationId = request.params.id;
    try {
      if (!conversationId) {
        return response.status(400).json({
          success: false,
          message: "Missing conversationId",
          status: 400,
        });
      }
      const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
      const conversation = await ConversationService.deleteConversation(
        conversationObjectId
      );
      return response.status(200).json({
        success: true,
        message: "Conversation deleted successfully",
        conversation: conversation,
      });
    } catch (error: any) {
      if (error.status) {
        return response.status(error.status).json({
          success: false,
          message: error.message,
          status: error.status,
        });
      }

      return response.status(500).json({
        success: false,
        message: "Error interno del servidor",
        status: 500,
      });
    }
  }
}

export default ConversationController;
