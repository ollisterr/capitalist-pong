import { Session } from './session';

export const initStore = () => {
  const sessions: Record<string, Session> = {};

  const getSessions = () => sessions;
  const getSession = (id: string): Session | undefined => sessions[id];

  const createSession = (id: string, adminConnection: string): Session => {
    if (id in sessions) {
      throw new Error('Session with the same ID already exists');
    }

    sessions[id] = new Session(id, adminConnection);

    console.info('Created new session:', id);
    return sessions[id];
  };

  const removePlayer = (socketId: string) => {
    const session = Object.values(sessions).find((session) => {
      const player = session.getPlayerByConnection(socketId);
      if (player) {
        console.info('Removing player!', player.name, player.id);
        return true;
      } else {
        return false;
      }
    });
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
