import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  AdminGameState,
  Commodity,
  companies,
  Company,
  GameState,
  User,
} from "@shared/types";
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
  shoppingCartValue: number;
  shoppingCart: {
    investments: Partial<Record<Company, number>>;
    commodities: Commodity[];
  };
  invest: (company: Company, count: number) => void;
  toggleCommodity: (commodity: Commodity) => void;
  resetShoppingCart: () => void;
  canAfford: (x: number) => boolean;
}

const AppContext = createContext<AppContext | null>(null);

const initialShoppingCart = {
  investments: Object.keys(companies).reduce(
    (acc, curr) => ({ ...acc, [curr]: 0 }),
    {} as Record<Company, number>
  ),
  commodities: [],
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [shoppingCart, setShoppingCart] =
    useState<AppContext["shoppingCart"]>(initialShoppingCart);
  const [gameState, setGameState] = useState<AppContext["gameState"]>(null);
  const [sessionId, setSessionId] = useState<AppContext["sessionId"]>(null);
  const [error, setError] = useState<AppContext["error"]>(null);

  const resetShoppingCart = () =>
    setShoppingCart({ investments: {}, commodities: [] });

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

  const shoppingCartValue =
    (
      Object.entries(shoppingCart.investments) as Array<[Company, number]>
    ).reduce(
      (acc, [company, stockCount]) =>
        acc + (gameState?.marketRates[company] ?? 0) * stockCount,
      0
    ) +
    shoppingCart.commodities.reduce(
      (acc, commodity) => acc + (gameState?.prices[commodity] ?? 0),
      0
    );

  const canAfford = (price: number) =>
    !isAdminState(gameState) &&
    !!gameState &&
    shoppingCartValue + price <= gameState.state.cash;

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
        shoppingCartValue,
        shoppingCart,
        invest: (company, count) => {
          if (
            count < 0 ||
            (gameState && canAfford(gameState.marketRates[company] * count))
          ) {
            const copy = { ...shoppingCart };
            copy.investments[company] =
              (copy.investments[company] ?? 0) + count;
            setShoppingCart(copy);
          }
        },
        toggleCommodity: (commodity) => {
          setShoppingCart((x) => ({
            ...x,
            commodities: x.commodities.includes(commodity)
              ? x.commodities.filter((y) => y !== commodity)
              : [...x.commodities, commodity],
          }));
        },
        resetShoppingCart,
        canAfford,
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
