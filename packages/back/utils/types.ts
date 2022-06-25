import { Commodity, PlayerState } from '@shared/types';

export type Prices = Record<Commodity, number>;

export type Player = {
  id: string;
  connection: string;
  state: PlayerState;
};
