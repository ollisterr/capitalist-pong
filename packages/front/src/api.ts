import axios from "axios";

import { NewGameResponse } from "@shared/api";

import { API_URL } from "./config/socket.config";

const client = axios.create({
  baseURL: API_URL,
});

const createGame = (gameId: string) =>
  client.post<NewGameResponse>("/create", { id: gameId });

export default { createGame };
