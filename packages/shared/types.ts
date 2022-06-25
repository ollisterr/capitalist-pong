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
  investments: Partial<Record<Company, number>>;
  commodities: Commodity[];
};

export type GameState = PlayerState[];
