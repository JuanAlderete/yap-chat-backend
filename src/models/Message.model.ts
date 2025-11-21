import mongoose from "mongoose";
import { IMessage } from "../types";
import Users from "./User.model";
import Conversations from "./Conversation.model";

const messageSchema = new mongoose.Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversations",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated_at: {
    type: Date,
    default: null,
  },
});

const Messages = mongoose.model<IMessage>("Messages", messageSchema);

export default Messages;
