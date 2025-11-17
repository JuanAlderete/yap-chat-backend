export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  _id?: string;
  conversationId: string;
  userId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversation {
  _id?: string;
  name?: string;
  participants: string[];
  lastMessage?: string;
  messages?: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}
