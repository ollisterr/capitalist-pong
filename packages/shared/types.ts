export const commodities = {
  ball: "Ping-pong ball",
};

export type Commodity = keyof typeof commodities;

export const companies = {
  profitBoys: "Profit Boys Ltd",
};

export type Company = keyof typeof companies;

export type PlayerState = {
  name: string;
  cash: number;
  commodities: Commodity[];
  investments: InvestmentPortfolio;
  offline: boolean;
};

export type InvestmentPortfolio = Record<Company, number>;

export type Prices = Record<Commodity, number>;

export type MarketRates = Record<Company, number>;

export type Standings = Array<{ name: PlayerState["name"]; valuation: number }>;

export type GameState = {
  started: boolean;
  turn: string | null;
  prices: Prices;
  marketRates: MarketRates;
  state: PlayerState;
  standings: Standings;
};

export type AdminGameState = Omit<GameState, "state"> & {
  state: PlayerState[];
};

export type User = {
  id: string;
  name: string;
};
