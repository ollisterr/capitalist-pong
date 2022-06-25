import { User } from "@shared/types";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import storageUtils from "../utils/storage.utils";

interface AppContext {
  playerId: string | null;
  playerName: string | null;
  setUser: (user: User) => void;
  sessionId: string | null;
  setSessionId: (x: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContext | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<AppContext["sessionId"]>(null);

  const [error, setError] = useState<AppContext["error"]>(null);

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
        playerId: user?.id ?? null,
        playerName: user?.name ?? null,
        setUser: updateUser,
        sessionId,
        setSessionId: updateSession,
        error,
        setError,
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
