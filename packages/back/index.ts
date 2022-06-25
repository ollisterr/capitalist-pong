import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { WelcomeMessage } from '@shared/messages.types';

import { initStore } from './utils/state';
import { invalidSession } from './utils/error';

const app = express();
app.use(cors());
app.use(express.json());

const server: http.Server = http.createServer(app);

const io: Server = require('socket.io')(server, {
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

  socket.on('admin-join', ({ sessionId, adminToken }) => {
    const session = getSession(sessionId);

    if (!session) {
      return socket.emit('invalidRoom');
    }

    if (adminToken === session.adminToken) {
      socket.join(sessionId);
      socket.emit('session-update', session);
    }
  });

  socket.on('rejoin', ({ sessionId, playerId }) => {
    console.info('Existing player joining session', sessionId);
    const session = getSession(sessionId);

    if (session) {
      const player = session.rejoin(socket.id, playerId);

      if (!player) {
        console.error('Non-existent player');
        return socket.emit('invalidPlayer');
      }

      socket.join(sessionId);

      const welcomeMessage: WelcomeMessage = {
        playerId: player.id,
        state: player.state,
      };

      // sync current session state
      socket.emit('welcome', welcomeMessage);
    } else {
      console.log('Invalid Game ID');
      socket.emit('invalidSession');
    }
  });

  socket.on('join', ({ sessionId, playerName }) => {
    console.info('New player joining session', sessionId);
    const session = getSession(sessionId);

    if (session) {
      try {
        const player = session.join(socket.id, playerName);
        socket.join(sessionId);

        const welcomeMessage: WelcomeMessage = {
          playerId: player.id,
          state: player.state,
        };

        // sync current session state
        socket.emit('welcome', welcomeMessage);
      } catch (e) {
        socket.emit('error', e);
      }
    } else {
      console.log('Invalid Room Code');
      socket.emit('invalidRoom');
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
    const session = createSession(req.body.id);

    console.info('Created new session:', session.id);
    res.json(session);
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

  io.to(sessionId).emit('update', updatedState);
});

app.listen(PORT + 1, () => {
  console.info(`WebSocket is listening on port ${PORT}!`);
  console.info(`App is listening on port ${PORT + 1}!`);
});
