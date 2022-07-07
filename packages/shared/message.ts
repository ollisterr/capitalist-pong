import { ErrorMessages } from "./error";
import { AdminGameState, Commodity, GameState, User } from "./types";

export type WelcomeMessage = {
  user: User;
  session: {
    id: string;
    state: GameState;
  };
};

export type AdminWelcomeMessage = {
  user: User;
  session: {
    id: string;
    state: AdminGameState;
  };
};

export enum SocketRequest {
  ADMIN_JOIN = "admin-join",
  JOIN = "join",
  REJOIN = "rejoin",
  PURCHASE = "purchase",
  START_GAME = "start",
  CREATE = "create",
}

export enum SocketMessage {
  WELCOME = "welcome",
  ERROR = "error",
  UPDATE = "session-update",
  // admin
  ADMIN_WELCOME = "admin-welcome",
  ADMIN_UPDATE = "admin-update",
}

export type ErrorMessage = {
  type: ErrorMessages;
  message: string;
};

export interface ServerToClientEvents {
  [SocketMessage.WELCOME]: (payload: WelcomeMessage) => void;
  [SocketMessage.UPDATE]: (payload: GameState) => void;
  // admin
  [SocketMessage.ADMIN_WELCOME]: (payload: AdminWelcomeMessage) => void;
  [SocketMessage.ADMIN_UPDATE]: (payload: AdminGameState) => void;
  // errors
  [SocketMessage.ERROR]: (payload: ErrorMessage | object) => void;
}

export interface ClientToServerEvents {
  [SocketRequest.ADMIN_JOIN]: (payload: {
    sessionId: string;
    adminToken: string;
  }) => void;
  [SocketRequest.JOIN]: (payload: {
    sessionId: string;
    playerName: string;
    playerId?: string;
  }) => void;
  [SocketRequest.REJOIN]: (payload: {
    sessionId: string;
    playerId: string;
  }) => void;
  [SocketRequest.PURCHASE]: (commodity: Commodity) => void;
  [SocketRequest.CREATE]: (payload: { id: string }) => void;
  [SocketRequest.START_GAME]: (payload: { sessionId: string }) => void;
}
