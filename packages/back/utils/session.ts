import { v4 as uuidv4 } from 'uuid';

import { Commodity, GameState, MarketRates, PlayerState } from '@shared/types';
import { defaultMarketRates, defaultPrices } from './game';
import { Player } from './player';
import { Prices } from './types';

type SessionTurn = {
  index: number;
  player: Player;
};

export class Session {
  id: string;

  prices: Prices = defaultPrices;
  marketRates: MarketRates = defaultMarketRates;
  players: Player[] = [];
  turn: SessionTurn | undefined = undefined;
  started = false;
  adminToken: string;

  constructor(id: string) {
    this.id = id;
    this.adminToken = uuidv4();
  }

  get state(): GameState {
    return {
      started: this.started,
      turn: this.turn?.index ?? null,
      prices: this.prices,
      marketRates: this.marketRates,
      state: this.players.map((player): PlayerState => player.state),
    };
  }

  rejoin(socketId: string, playerId: string) {
    const player = this.getPlayerById(playerId);

    if (!player) {
      return null;
    }

    player.updateConnection(socketId);

    return player;
  }

  join(socketId: string, playerName: string) {
    if (this.started) {
      throw new Error("Can't join a game that's already on-going");
    }
    if (this.players.some((player) => player.name === playerName)) {
      throw new Error('Player name is already taken');
    }

    const player = new Player(playerName, socketId);
    this.players.push(player);

    console.log('Added new player', this.players);

    return player;
  }

  removePlayerById(playerId: string) {
    this.players = this.players.filter((player) => player.id !== playerId);
  }
  removePlayerByConnection(socketId: string) {
    this.players = this.players.filter(
      (player) => player.connection !== socketId,
    );
  }

  getPlayerById(playerId: string) {
    return this.players.find((player) => (player.id = playerId));
  }

  getPlayerByConnection(socketId: string) {
    return this.players.find((player) => (player.connection = socketId));
  }

  start(): GameState {
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

  nextTurn() {
    if (!this.turn) {
      throw new Error("The game hasn't started yet");
    }

    const {
      player: { id: playerId },
      index,
    } = this.turn;

    let newIndex: number;

    if (this.players[index].id === playerId) {
      newIndex = (index + 1) % this.players.length;
    } else if (this.players.some((player) => player.id === playerId)) {
      newIndex = this.players.findIndex((player) => player.id === playerId);
    } else {
      newIndex = (index + 1) % this.players.length;
    }

    this.turn = { player: this.players[newIndex], index: newIndex };

    return this.state;
  }
}
