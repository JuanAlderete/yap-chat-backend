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
  senderId: mongoose.Types.ObjectId | string;
  conversationId: mongoose.Types.ObjectId | string;
  content: string;
  isRead?: Boolean;
  readAt?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface IConversation {
  _id?: mongoose.Types.ObjectId | string;
  name?: string;
  participants: (mongoose.Types.ObjectId | string)[];
  lastMessage?: string;
  lastMessageAt?: Date;
  messages?: IMessage[];
  created_at?: Date;
  updated_at?: Date;
  isGroup?: Boolean;
}

export interface CreateConversationDTO {
  name: string;
  participantId: mongoose.Types.ObjectId | string;
}

export interface ConversationResponse {
  success: boolean;
  conversation: IConversation;
}

export interface ConversationListItem {
  _id: mongoose.Types.ObjectId | string;
  otherUser: IUser;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
}

export interface IConversationPopulated
  extends Omit<IConversation, "participants"> {
  participants: IUser[];
}

export interface SendMessageDTO {
  conversationId: mongoose.Types.ObjectId;
  content: string;
}

export interface MessageResponse {
  success: boolean;
  message: IMessage;
}

export interface MessagesListResponse {
  success: boolean;
  messages: IMessage[];
}

export interface IMessagePopulated extends Omit<IMessage, "senderId"> {
  senderId: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface UpdateMessageDTO {
  content: string;
}
