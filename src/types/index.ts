import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  verificationToken?: string;
  created_at: Date;
  updated_at?: Date;
  active: boolean;
}

export interface IMessage {
  _id?: mongoose.Types.ObjectId | string;
  conversationId: string;
  userId: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IConversation {
  _id?: mongoose.Types.ObjectId | string;
  name?: string;
  participants: string[];
  lastMessage?: string;
  messages?: IMessage[];
  created_at?: Date;
  updated_at?: Date;
}
