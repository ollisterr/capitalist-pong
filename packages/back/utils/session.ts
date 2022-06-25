import { v4 as uuidv4 } from 'uuid';

import { GameState, PlayerState } from '@shared/types';
import { defaultPrices } from './game';
import { Player } from './player';
import { Prices } from './types';

type SessionTurn = {
  index: number;
  player: Player;
};

export class Session {
  id: string;

  prices: Prices = defaultPrices;
  players: Player[] = [];
  turn: SessionTurn | undefined = undefined;
  started = false;
  adminToken: string;

  constructor(id: string) {
    this.id = id;
    this.adminToken = uuidv4();
  }

  get state(): GameState {
    if (!this.turn) {
      return { turn: 0, state: [] };
    }

    return {
      turn: this.turn.index,
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
