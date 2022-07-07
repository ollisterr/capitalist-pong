import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { AdminGameState, GameState, User } from "@shared/types";
import storageUtils from "../utils/storage.utils";

export const isAdminState = (
  state: AppContext["gameState"]
): state is AdminGameState => !!state && Array.isArray(state.state);

interface AppContext {
  playerId: string | null;
  playerName: string | null;
  setUser: (user: User) => void;
  sessionId: string | null;
  setSessionId: (x: string | null) => void;
  error: string | object | null;
  setError: (error: string | object | null) => void;
  gameState: GameState | AdminGameState | null;
  setGameState: (state: GameState | AdminGameState | null) => void;
  isAdmin: boolean;
}

const AppContext = createContext<AppContext | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<AppContext["gameState"]>(null);
  const [sessionId, setSessionId] = useState<AppContext["sessionId"]>(null);
  const [error, setError] = useState<AppContext["error"]>(null);

  useEffect(() => {
    const existingUser = storageUtils.getUser();
    setUser(existingUser);

    const existingSession = storageUtils.getSession();

    if (existingSession) {
      setSessionId(existingSession);
      navigate(`/game/${existingSession}`);
    }
  }, []);

  const updateUser = (user: User | null) => {
    setUser(user);

    if (user) {
      storageUtils.setUser(user);
    } else {
      storageUtils.removeUser();
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
        isAdmin: isAdminState(gameState) || !!storageUtils.getAdminToken(),
        playerId: user?.id ?? null,
        playerName: user?.name ?? null,
        setUser: updateUser,
        sessionId,
        setSessionId: updateSession,
        error,
        setError,
        gameState,
        setGameState,
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
