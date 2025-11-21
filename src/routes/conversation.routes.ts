import express from "express";
import ConversationController from "../controllers/conversation.controller";
import authenticate from "../middleware/auth.middleware";
import {
  validateCreateConversation,
  validateConversationId,
} from "../middleware/validator.middleware";

const conversationRoutes: express.Router = express.Router();

conversationRoutes.use(authenticate);

conversationRoutes.post(
  "/",
  validateCreateConversation,
  ConversationController.createConversation
);

conversationRoutes.get("/", ConversationController.getMyConversations);

conversationRoutes.get(
  "/:id",
  validateConversationId,
  ConversationController.getConversationById
);

conversationRoutes.delete(
  "/:id",
  validateConversationId,
  ConversationController.deleteConversation
);

export default conversationRoutes;
