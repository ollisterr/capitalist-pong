enum Storage {
  SESSION = "session",
  ADMIN_TOKEN = "admin_token",
  PLAYER_ID = "player_id",
}

const getSession = () => localStorage.getItem(Storage.SESSION);

const setSession = (sessionId: string) =>
  localStorage.setItem(Storage.SESSION, sessionId);

const removeSession = () => localStorage.removeItem(Storage.SESSION);

const setPlayerId = (playerId: string) =>
  localStorage.setItem(Storage.PLAYER_ID, playerId);

const removePlayerId = () => localStorage.removeItem(Storage.PLAYER_ID);

const getPlayerId = () => localStorage.getItem(Storage.PLAYER_ID);

const setAdminToken = (token: string) =>
  localStorage.setItem(Storage.ADMIN_TOKEN, token);

const getAdminToken = () => localStorage.getItem(Storage.ADMIN_TOKEN);

export default {
  getSession,
  setSession,
  removeSession,
  getPlayerId,
  setPlayerId,
  removePlayerId,
  getAdminToken,
  setAdminToken,
};
