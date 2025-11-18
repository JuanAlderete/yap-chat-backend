import { IUser } from ".";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
