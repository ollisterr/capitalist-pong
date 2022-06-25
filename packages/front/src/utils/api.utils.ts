import axios from "axios";
import { API_URL } from "../config/socket.config";

const client = axios.create({
  baseURL: API_URL,
});

export const createGame = (gameId: string) => client.post("/create", gameId);
