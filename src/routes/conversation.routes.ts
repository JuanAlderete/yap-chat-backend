import express from "express";
import ConversationController from "../controllers/conversation.controller";
import authenticate from "../middleware/auth.middleware";
import {
  validateCreateConversation,
  validateConversationId,
} from "../middleware/validator.middleware";

const conversationRoutes: express.Router = express.Router();

// Todas las rutas requieren autenticación
conversationRoutes.use(authenticate);

// POST /api/conversations - Crear conversación
conversationRoutes.post(
  "/",
  validateCreateConversation,
  ConversationController.createConversation
);

// GET /api/conversations - Listar mis conversaciones
conversationRoutes.get("/", ConversationController.getMyConversations);

// GET /api/conversations/:id - Obtener conversación por ID
conversationRoutes.get(
  "/:id",
  validateConversationId,
  ConversationController.getConversationById
);

// DELETE /api/conversations/:id - Eliminar conversación
conversationRoutes.delete(
  "/:id",
  validateConversationId,
  ConversationController.deleteConversation
);

export default conversationRoutes;
