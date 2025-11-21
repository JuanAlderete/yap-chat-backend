import mongoose from "mongoose";
import { IConversation, IMessage } from "../types";
import Users from "./User.model";

const conversationSchema = new mongoose.Schema<IConversation>({
  name: {
    type: String,
  },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  ],
  lastMessage: {
    type: String,
    default: null,
  },
  messages: {
    type: Array<IMessage>,
    default: [],
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
  isGroup: {
    type: Boolean,
    default: false,
  },
});

const Conversations = mongoose.model<IConversation>(
  "Conversations",
  conversationSchema
);

export default Conversations;
