import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  active: boolean;
}

export interface IMessage {
  _id?: mongoose.Types.ObjectId | string;
  conversationId: string;
  userId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversation {
  _id?: mongoose.Types.ObjectId | string;
  name?: string;
  participants: string[];
  lastMessage?: string;
  messages?: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}
