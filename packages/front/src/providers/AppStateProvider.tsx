import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { GameState, PlayerState, User } from "@shared/types";
import storageUtils from "../utils/storage.utils";

interface AppContext {
  playerId: string | null;
  playerName: string | null;
  setUser: (user: User) => void;
  sessionId: string | null;
  setSessionId: (x: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  gameState: GameState | null;
  setGameState: (state: GameState | null) => void;
  playerState: PlayerState | null;
  isAdmin: boolean;
}

const AppContext = createContext<AppContext | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<AppContext["gameState"]>(null);
  const [sessionId, setSessionId] = useState<AppContext["sessionId"]>(null);
  const [error, setError] = useState<AppContext["error"]>(null);
  const [isAdmin, setIsAdmin] = useState<AppContext["isAdmin"]>(false);

  useEffect(() => {
    const adminToken = storageUtils.getAdminToken();
    setIsAdmin(!!adminToken);
  }, []);

  const updateUser = (user: User | null) => {
    setUser(user);

    if (user) {
      storageUtils.setPlayerId(user.id);
    } else {
      storageUtils.removePlayerId();
    }
  };

  const updateSession = (id: string | null) => {
    setSessionId(id);

    if (id) {
      storageUtils.setSession(id);
    } else {
      storageUtils.removeSession();
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAdmin,
        playerId: user?.id ?? null,
        playerName: user?.name ?? null,
        setUser: updateUser,
        sessionId,
        setSessionId: updateSession,
        error,
        setError,
        gameState,
        setGameState,
        playerState:
          gameState?.state.find((player) => player.name === user?.name) ?? null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const state = useContext(AppContext);

  if (!state) {
    throw new Error("useAppState was used outside AppStateProvider");
  }

  return state;
};
