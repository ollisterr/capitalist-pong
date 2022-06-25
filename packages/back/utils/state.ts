import { Session } from './session';

export const initStore = () => {
  const sessions: Record<string, Session> = {};

  const getSessions = () => sessions;
  const getSession = (id: string): Session | undefined => sessions[id];

  const createSession = (id: string): Session => {
    if (id in sessions) {
      throw new Error('Session with the same ID already exists');
    }

    const session = new Session(id);
    sessions[session.id] = session;

    return session;
  };

  const removePlayer = (socketId: string) => {
    const session = Object.values(sessions).find(
      (session) => !!session.getPlayerByConnection(socketId),
    );
    session?.removePlayerByConnection(socketId);
    return session?.id;
  };

  return {
    getSessions,
    getSession,
    createSession,
    removePlayer,
  };
};
