import { ErrorMessages } from '@shared/error';
import { SocketMessage } from '@shared/message';
import { Socket } from 'socket.io';

export const invalidSession = (socket: Socket, sessionId: string) => {
  console.error('Invalid Game ID', sessionId);
  socket.emit(SocketMessage.ERROR, {
    type: ErrorMessages.INVALID_SESSION,
    message: `Invalid game ID: ${sessionId}`,
  });
};
