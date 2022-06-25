export const getSession = () => localStorage.getItem("session");

export const setPlayerId = (playerId: string) =>
  localStorage.setItem("id", playerId);

export const getPlayerId = () => localStorage.getItem("id");
