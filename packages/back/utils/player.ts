import { Commodity, Company, PlayerState } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';

export class Player {
  id: string;
  name: string;
  connection: string;

  cash = 0;
  investements: Partial<Record<Company, number>> = {};
  commodities: Commodity[] = [];

  constructor(name: string, socketId: string) {
    this.id = uuidv4();
    this.name = name;
    this.connection = socketId;
  }

  get state(): PlayerState {
    return {
      name: this.name,
      cash: this.cash,
      commodities: this.commodities,
    };
  }

  updateConnection(socketId: string) {
    this.connection = socketId;
  }
}
