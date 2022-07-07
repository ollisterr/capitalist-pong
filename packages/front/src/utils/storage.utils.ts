import { User } from "@shared/types";

enum Storage {
  SESSION = "session",
  ADMIN_TOKEN = "admin_token",
  PLAYER_ID = "player_id",
  USER = "user",
}

const getSession = () => localStorage.getItem(Storage.SESSION);

const setSession = (sessionId: string) =>
  localStorage.setItem(Storage.SESSION, sessionId);

const removeSession = () => localStorage.removeItem(Storage.SESSION);

const setUser = (user: User) =>
  localStorage.setItem(Storage.USER, JSON.stringify(user));

const removeUser = () => localStorage.removeItem(Storage.USER);

const getUser = (): User | null => {
  const storedValue = localStorage.getItem(Storage.USER);
  if (!storedValue) return null;
  return JSON.parse(storedValue);
};

const setAdminToken = (token: string) =>
  localStorage.setItem(Storage.ADMIN_TOKEN, token);

const getAdminToken = () => localStorage.getItem(Storage.ADMIN_TOKEN);

const removeAdminToken = () => localStorage.removeItem(Storage.ADMIN_TOKEN);

export default {
  getSession,
  setSession,
  removeSession,
  getUser,
  setUser,
  removeUser,
  getAdminToken,
  setAdminToken,
  removeAdminToken,
};
