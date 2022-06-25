import { PlayerState } from "./types";

export type WelcomeMessage = {
  playerId: string;
  state: PlayerState;
};

export const messageTypes = ["welcome", "join"] as const;

export type MessageType = typeof messageTypes[number];

export type MessagePayloads = {
  welcome: WelcomeMessage;
};
