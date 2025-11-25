import { Request, Response, NextFunction } from "express";
import { validationResult, body, param } from "express-validator";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      status: 400,
      errors: errors.array(),
    });
  }

  next();
};

// Intento de validaciones con express-validator

export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

export const validateVerifyEmail = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Token is required")
    .isLength({ min: 6 })
    .withMessage("Token must be at least 6 characters"),

  handleValidationErrors,
];

export const validateCreateConversation = [
  body("participantId")
    .trim()
    .notEmpty()
    .withMessage("ParticipantId is required")
    .isMongoId()
    .withMessage("Invalid participantId")
    .isLength({ min: 24 })
    .withMessage("ParticipantId must be at least 24 characters"),

  handleValidationErrors,
];

export const validateConversationId = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid id")
    .isLength({ min: 24 })
    .withMessage("Id must be at least 24 characters"),

  handleValidationErrors,
];

export const validateSendMessage = [
  body("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .isMongoId()
    .withMessage("Invalid conversation ID"),

  body("content")
    .notEmpty()
    .withMessage("Message content is required")
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage("Message must be between 1 and 5000 characters"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateGetMessages = [
  param("conversationId").isMongoId().withMessage("Invalid conversation ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateMessageId = [
  param("id").isMongoId().withMessage("Invalid message ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("avatar").optional().trim().isLength({ min: 2 }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateUpdateMessage = [
  param('id')
    .isMongoId().withMessage('Invalid message ID'),
  
  body('content')
    .notEmpty().withMessage('Message content is required')
    .trim()
    .isLength({ min: 1, max: 5000 }).withMessage('Message must be between 1 and 5000 characters'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];
