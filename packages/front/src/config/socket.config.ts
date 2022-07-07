import { io, Socket } from "socket.io-client";

import { ServerToClientEvents, ClientToServerEvents } from "@shared/message";

const PORT = 8000;

export const SOCKET_URL = `${
  window.location.origin.match("localhost")
    ? "http://localhost"
    : window.location.origin
}:${PORT}`;

export const API_URL = `${
  window.location.origin.match("localhost")
    ? "http://localhost"
    : window.location.origin
}:${PORT + 1}`;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  { autoConnect: false }
);
