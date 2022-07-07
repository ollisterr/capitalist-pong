import { v4 as uuidv4 } from 'uuid';

import {
  AdminGameState,
  Commodity,
  Company,
  GameState,
  MarketRates,
  Standings,
} from '@shared/types';
import { defaultMarketRates, defaultPrices, defaultRevenue } from './game';
import { Player } from './player';
import { Prices } from './types';

type SessionTurn = {
  index: number;
  player: Player;
};

type PublicGameState = Omit<GameState, 'state'>;

export class Session {
  id: string;
  prices: Prices = defaultPrices;
  marketRates: MarketRates = defaultMarketRates;
  players: Player[] = [];
  turn: SessionTurn | undefined = undefined;
  started = false;
  round = 0;

  adminToken: string;
  adminConnection: string;

  removeQueue: Record<string, NodeJS.Timeout> = {};

  constructor(id: string, adminConnection: string) {
    this.id = id;
    this.adminToken = uuidv4();
    this.adminConnection = adminConnection;
  }

  get standings(): Standings {
    return [...this.players]
      .map((player) => ({
        name: player.name,
        valuation:
          player.cash +
          (
            Object.entries(player.investments) as Array<[Company, number]>
          ).reduce(
            (total, [investment, stockCount]) =>
              total + this.marketRates[investment] * stockCount,
            0,
          ),
      }))
      .sort((a, b) => a.valuation - b.valuation);
  }

  get state(): PublicGameState {
    return {
      started: this.started,
      turn: this.turn?.player.name ?? null,
      prices: this.prices,
      marketRates: this.marketRates,
      standings: this.standings,
    };
  }

  get adminState(): AdminGameState {
    return {
      ...this.state,
      state: this.players,
    };
  }

  validateAdmin(token: string) {
    return (
      this.adminToken === token ||
      (!!this.adminConnection && this.adminConnection === token)
    );
  }

  rejoin(socketId: string, playerId: string, playerName?: string) {
    const player =
      this.getPlayerById(playerId) ?? this.getPlayerByConnection(socketId);

    if (!player) {
      return null;
    }

    if (playerName) {
      player.name = playerName;
    }

    // cancel timeout if the user was being removed
    if (this.removeQueue[playerId]) {
      player.offline = false;
      clearTimeout(this.removeQueue[playerId]);
    }
    player.updateConnection(socketId);

    return player;
  }

  join(socketId: string, playerName: string) {
    if (this.players.some((player) => player.name === playerName)) {
      console.info('Existing players:', this.players);
      throw new Error('Player name is already taken: ' + playerName);
    }

    const player = new Player(playerName, socketId);
    this.players.push(player);

    console.log('Added new player', this.players);

    return player;
  }

  removePlayerById(playerId: string) {
    // remove player only after five minutes of being idle
    // and see if they rejoin
    const player = this.getPlayerById(playerId);

    if (player) {
      player.offline = true;
      const removeTimeout = setTimeout(() => {
        this.players = this.players.filter((player) => player.id !== playerId);
      }, 5 * 60 * 1000);
      this.removeQueue[playerId] = removeTimeout;
    }
  }

  removePlayerByConnection(socketId: string) {
    const player = this.getPlayerByConnection(socketId);
    if (player) {
      player.offline = true;
      this.removePlayerById(player.id);
    }
  }

  getPlayerById(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  getPlayerByConnection(socketId: string) {
    return this.players.find((player) => player.connection === socketId);
  }

  start(): PublicGameState {
    this.turn = { index: 0, player: this.players[0] };
    this.started = true;

    return this.state;
  }

  purchase(playerId: string, commodity: Commodity) {
    const player = this.getPlayerById(playerId);

    if (!player) {
      throw new Error('Non-existent player');
    }

    const price = this.prices[commodity];

    if (player.cash > price) {
      player.commodities.push(commodity);
      player.cash -= price;
    } else {
      throw new Error('Insufficient funds');
    }
  }

  updateEquity() {
    this.players.forEach((player) => {
      player.cash += defaultRevenue;
    });

    console.log('Updated equity', this.players);

    this.marketRates = this.marketRates;
  }

  updatePrices() {
    this.prices = this.prices;
  }

  nextTurn(
    investments: Partial<Record<Company, number>> = {},
    commodities: Commodity[] = [],
  ) {
    if (!this.turn) {
      throw new Error("The game hasn't started yet");
    }

    const { player, index } = this.turn;
    const playerId = player.id;

    const investmentCost = (
      Object.entries(investments) as Array<[Company, number]>
    ).reduce(
      (acc, [company, count]) => acc + this.marketRates[company] * count,
      0,
    );

    const commodityCost = commodities.reduce(
      (acc, commodity) => acc + this.prices[commodity],
      0,
    );

    // investment earnings can't be used for purchasing in the same round
    if (Math.max(investmentCost, 0) + commodityCost > player.cash) {
      throw new Error('Kusettaja paska :D');
    }

    (Object.entries(investments) as Array<[Company, number]>).forEach(
      ([company, stockCount]) => {
        player.investments[company] = Math.max(
          0,
          (player.investments[company] ?? 0) + stockCount,
        );
      },
    );

    commodities.forEach((commodity) => {
      if (!player.commodities.includes(commodity)) {
        player.commodities.push(commodity);
      }
    });

    player.cash = player.cash - investmentCost - commodityCost;

    // update turn
    let newIndex: number;

    if (this.players[index].id === playerId) {
      newIndex = (index + 1) % this.players.length;
    } else if (this.players.some((player) => player.id === playerId)) {
      newIndex = this.players.findIndex((player) => player.id === playerId);
    } else {
      newIndex = (index + 1) % this.players.length;
    }

    if (index === 0) {
      this.updateEquity();
    }

    this.updatePrices();

    this.turn = { player: this.players[newIndex], index: newIndex };

    return this.state;
  }
}
