import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
}

export interface UserActivityPayload {
  userId: string;
  activity: 'writing' | 'stoppedWriting';
}