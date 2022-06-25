import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketMessage,
  SocketRequest,
  WelcomeMessage,
} from '@shared/message';

import { initStore } from './utils/state';
import { invalidSession } from './utils/error';

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

const { createSession, getSession, removePlayer, getSessions } = initStore();

io.on('connection', (socket) => {
  if (!socket.handshake.headers.origin) {
    // high chance it's a script kiddie
    socket.disconnect();
    return;
  }

  console.info('New connection', socket.id);
  console.info('Active sessions:', Object.values(getSessions()).length);

  socket.on(SocketRequest.ADMIN_JOIN, ({ sessionId, adminToken }) => {
    console.info('Admin with token', adminToken, 'joining to', sessionId);

    const session = getSession(sessionId);

    if (!session) {
      return socket.emit(SocketMessage.ERROR, 'Invalid Game ID');
    }

    if (adminToken === session.adminToken) {
      socket.join(sessionId);
      socket.emit(SocketMessage.WELCOME, {
        user: {
          id: adminToken,
          name: 'Game Host',
        },
        session: { id: session.id, state: session.state },
      });
    }
  });

  socket.on(SocketRequest.REJOIN, ({ sessionId, playerId }) => {
    console.info('Existing player joining session', sessionId);
    const session = getSession(sessionId);

    if (session) {
      const player = session.rejoin(socket.id, playerId);

      if (!player) {
        console.error('Non-existent player');
        return socket.emit(SocketMessage.ERROR, 'Invalid player name');
      }

      socket.join(sessionId);

      const welcomeMessage: WelcomeMessage = {
        user: {
          id: player.id,
          name: player.name,
        },
        session: {
          id: session.id,
          state: session.state,
        },
      };

      // sync current session state
      socket.emit(SocketMessage.WELCOME, welcomeMessage);
    } else {
      console.log('Invalid Game ID');
      socket.emit(SocketMessage.ERROR, 'Invalid Game ID');
    }
  });

  socket.on(SocketRequest.JOIN, ({ sessionId, playerName }) => {
    console.info('New player', playerName, 'joining session', sessionId);
    const session = getSession(sessionId);

    if (session) {
      try {
        const player = session.join(socket.id, playerName);
        socket.join(sessionId);

        // sync current session state
        socket.emit(SocketMessage.WELCOME, {
          user: {
            id: player.id,
            name: player.name,
          },
          session: {
            id: session.id,
            state: session.state,
          },
        });
      } catch (e: any) {
        socket.emit(SocketMessage.ERROR, e);
      }
    } else {
      console.log('Invalid Room Code');
      socket.emit(SocketMessage.ERROR, 'Invalid Game ID');
    }
  });

  socket.once('disconnect', () => {
    const sessionId = removePlayer(socket.id);

    if (sessionId) {
      socket.leave(sessionId);
    }
  });
});

// WEB SOCKET

const PORT = Number(process.env.PORT) || 8000;

io.listen(PORT);

// ROUTES

app.get('/', (_, res) => res.send('Hello world!'));

app.post('/create', async (req, res) => {
  if (!req.body?.id) {
    res.status(400).json({ message: 'Game ID is missing', code: 400 });
  }

  try {
    const { id, adminToken } = createSession(req.body.id);

    console.info('Created new session:', id);
    res.json({ id, adminToken });
  } catch (e) {
    res
      .status(400)
      .json({ message: 'Game with the same ID already exists', code: 400 });
  }
});

app.post('/next/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const session = getSession(sessionId);

  if (!session) {
    return invalidSession(res);
  }

  const updatedState = session.nextTurn();

  io.to(sessionId).emit(SocketMessage.UPDATE, updatedState);
});

app.post('/start/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const session = getSession(sessionId);

  if (!session) {
    return invalidSession(res);
  }

  const updatedState = session.start();

  io.to(sessionId).emit(SocketMessage.UPDATE, updatedState);
});

app.listen(PORT + 1, () => {
  console.info(`WebSocket is listening on port ${PORT}!`);
  console.info(`App is listening on port ${PORT + 1}!`);
});
