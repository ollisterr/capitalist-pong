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
};

export type Prices = Record<Commodity, number>;

export type MarketRates = Record<Company, number>;

export type GameState = {
  started: boolean;
  turn: number | null;
  prices: Prices;
  marketRates: MarketRates;
  state: PlayerState[];
};

export type User = {
  id: string;
  name: string;
};
