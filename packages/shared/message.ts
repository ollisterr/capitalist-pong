import { GameState, User } from "./types";

export type WelcomeMessage = {
  user: User;
  session: {
    id: string;
    state: GameState;
  };
};

export enum SocketRequest {
  ADMIN_JOIN = "admin-join",
  JOIN = "join",
  REJOIN = "rejoin",
}

export enum SocketMessage {
  WELCOME = "welcome",
  ERROR = "error",
  UPDATE = "session-update",
}

export interface ServerToClientEvents {
  [SocketMessage.WELCOME]: (payload: WelcomeMessage) => void;
  [SocketMessage.UPDATE]: (payload: GameState) => void;
  // errors
  [SocketMessage.ERROR]: (payload: string) => void;
}

export interface ClientToServerEvents {
  [SocketRequest.ADMIN_JOIN]: (payload: {
    sessionId: string;
    adminToken: string;
  }) => void;
  [SocketRequest.JOIN]: (payload: {
    sessionId: string;
    playerName: string;
  }) => void;
  [SocketRequest.REJOIN]: (payload: {
    sessionId: string;
    playerId: string;
  }) => void;
}
