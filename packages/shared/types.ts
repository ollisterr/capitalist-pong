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

export type GameState = { turn: number; state: PlayerState[] };

export type User = {
  id: string;
  name: string;
};
