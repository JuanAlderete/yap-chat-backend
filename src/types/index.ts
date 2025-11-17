export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface IMessage {
  _id?: string;
  text: string;
  user: string;
  createdAt: Date;
}

export interface IConversation {
  _id?: string;
  name: string;
  messages: IMessage[];
}
