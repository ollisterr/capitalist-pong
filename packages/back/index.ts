import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketMessage,
  SocketRequest,
} from '@shared/message';
import { ErrorMessages } from '@shared/error';
import { Session } from 'utils/session';

import { initStore } from './utils/state';
import { invalidSession } from 'utils/error';
import { Player } from 'utils/player';

const app = express();
app.use(cors());
app.use(express.json());

const server: http.Server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

// send each player in the session an update of the game and their standing
const sendSessionUpdate = (session: Session) => {
  console.info('> Sending update:', session.state);
  session.players.forEach((player) => {
    io.to(player.connection).emit(SocketMessage.UPDATE, {
      ...session.state,
      state: player,
    });
  });
  // send admin update as well
  sendAdminUpdate(session);
};

const sendAdminUpdate = (session: Session) => {
  console.info('> Sending admin update:', session.state);
  io.to(session.adminConnection).emit(
    SocketMessage.ADMIN_UPDATE,
    session.adminState,
  );
};

const { createSession, getSession, removePlayer, getSessions } = initStore();

io.on('connection', (socket) => {
  if (!socket.handshake.headers.origin) {
    // high chance it's a script kiddie
    socket.disconnect();
    return;
  }

  console.info('New connection', socket.id);
  console.info('Active sessions:', Object.values(getSessions()).length);

  let session: Session | undefined;

  socket.on(SocketRequest.CREATE, ({ id }) => {
    session = createSession(id, socket.id);

    // update socket connection
    session.adminConnection = socket.id;
    // join room
    socket.join(session.id);
    // send welcome message
    socket.emit(SocketMessage.ADMIN_WELCOME, {
      user: {
        id: session.adminToken,
        name: 'Game Host',
      },
      session: {
        id: session.id,
        state: session.adminState,
      },
    });
  });

  socket.on(SocketRequest.JOIN, ({ sessionId, playerName, playerId }) => {
    console.info('Player', playerName, 'joining session', sessionId);

    if (session) {
      const sessionId = removePlayer(socket.id);
      if (sessionId) {
        socket.leave(sessionId);
      }
    }

    session = getSession(sessionId);

    if (
      !session ||
      (session.started &&
        playerId &&
        (!session.getPlayerById(playerId) || session.validateAdmin(playerId)))
    ) {
      console.error(ErrorMessages.INVALID_SESSION, sessionId);
      return invalidSession(socket);
    }

    if (playerId && session.validateAdmin(playerId)) {
      // update socket connection
      session.adminConnection = socket.id;
      // join room
      socket.join(sessionId);
      // send welcome message
      socket.emit(SocketMessage.ADMIN_WELCOME, {
        user: {
          id: playerId,
          name: 'Game Host',
        },
        session: {
          id: session.id,
          state: session.adminState,
        },
      });
      sendAdminUpdate(session);
    } else {
      try {
        let player: Player | null = null;
        if (playerId) {
          player = session.rejoin(socket.id, playerId, playerName);
        }

        if (!player) {
          player = session.join(socket.id, playerName);
        }

        socket.join(sessionId);

        // sync current session state
        socket.emit(SocketMessage.WELCOME, {
          user: {
            id: player.id,
            name: player.name,
          },
          session: {
            id: session.id,
            state: { ...session.state, state: player },
          },
        });

        // update all players
        sendSessionUpdate(session);
      } catch (e: any) {
        console.error('ERROR!', e);
        socket.emit(SocketMessage.ERROR, {
          type: ErrorMessages.USER_TAKEN,
          message: 'Username is already taken',
        });
      }
    }
  });

  socket.on(SocketRequest.START_GAME, () => {
    if (!session) {
      console.error('Invalid Session ID');
      return invalidSession(socket);
    }

    if (!session.validateAdmin(socket.id)) {
      console.error('Invalid admin token for session');
      return socket.emit(SocketMessage.ERROR, {
        type: ErrorMessages.NOT_ALLOWED,
      });
    }

    session.start();
    sendSessionUpdate(session);
  });

  socket.on(SocketRequest.NEXT_TURN, ({ investments, commodities }) => {
    console.info('Switching turns');
    if (!session) {
      console.error('Invalid Session ID');
      return invalidSession(socket);
    }

    const player = session.getPlayerByConnection(socket.id);

    if (
      !session.started ||
      (session.started &&
        player?.id !== session.turn?.player.id &&
        session.adminConnection !== socket.id)
    ) {
      return socket.emit(SocketMessage.ERROR, {
        message: "It's not your turn",
      });
    }

    session.nextTurn(investments, commodities);
    sendSessionUpdate(session);
  });

  socket.once('disconnect', () => {
    const sessionId = removePlayer(socket.id);

    if (sessionId) {
      socket.leave(sessionId);
    }

    if (session) {
      sendAdminUpdate(session);
    }
  });
});

// WEB SOCKET

const PORT = Number(process.env.PORT) || 8000;

io.listen(PORT);

// ROUTES

app.get('/', (_, res) => res.send('Hello world!'));

app.listen(PORT + 1, () => {
  console.info(`WebSocket is listening on port ${PORT}!`);
  console.info(`App is listening on port ${PORT + 1}!`);
});
