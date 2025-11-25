import express from "express";
import authenticate from "../middleware/auth.middleware";
import {
  validateGetMessages,
  validateMessageId,
  validateSendMessage,
  validateUpdateMessage
} from "../middleware/validator.middleware";
import MessageController from "../controllers/message.controller";

const messagesRoutes: express.Router = express.Router();

messagesRoutes.use(authenticate);

messagesRoutes.post("/", validateSendMessage, MessageController.sendMessage);

messagesRoutes.get(
  "/:conversationId",
  validateGetMessages,
  MessageController.getMessagesByConversation
);

messagesRoutes.delete(
  "/:id",
  validateMessageId,
  MessageController.deleteMessage
);

messagesRoutes.put(
  "/:id",
  validateUpdateMessage,
  MessageController.updateMessage
);

export default messagesRoutes;
