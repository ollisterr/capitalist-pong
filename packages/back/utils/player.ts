import {
  Commodity,
  companies,
  Company,
  InvestmentPortfolio,
  PlayerState,
} from '@shared/types';
import { v4 as uuidv4 } from 'uuid';
import { defaultRevenue } from './game';

export class Player {
  id: string;
  name: string;
  connection: string;
  offline: boolean = false;

  cash = defaultRevenue;
  investments = Object.keys(companies).reduce<InvestmentPortfolio>(
    (acc, curr) => ({ ...acc, [curr]: 0 }),
    {} as InvestmentPortfolio,
  );
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
      investments: this.investments,
      offline: this.offline,
    };
  }

  updateConnection(socketId: string) {
    this.connection = socketId;
  }

  equity(marketRates: Record<Company, number>) {
    return (
      Object.entries(this.investments) as Array<[Company, number]>
    ).reduce((acc, [company, count]) => acc + marketRates[company] * count, 0);
  }
}
