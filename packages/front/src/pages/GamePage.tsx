import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { socket } from "../config/socket.config";
import { SocketMessage, SocketRequest } from "@shared/message";
import { useAppState } from "../providers/AppStateProvider";
import { NavBar, Players } from "../components";
import { GameView } from "../components/GameView";

export const GamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ sessionId: string }>();

  const {
    playerId,
    playerName,
    setUser,
    sessionId,
    setSessionId,
    gameState,
    setGameState,
    isAdmin,
  } = useAppState();

  useEffect(() => {
    if (!params.sessionId) {
      return navigate("/");
    }

    if (sessionId !== params.sessionId) {
      setSessionId(params.sessionId);
    }

    if ((location.state as any)?.playerName || playerId) {
      socket.emit(SocketRequest.JOIN, {
        sessionId: params.sessionId,
        playerName: (location.state as any)?.playerName ?? playerName,
        playerId: playerId ?? undefined,
      });
    } else {
      navigate("/");
    }
  }, [sessionId, params.sessionId]);

  useEffect(() => {
    socket.connect();

    socket.on(SocketMessage.WELCOME, ({ user, session }) => {
      setUser(user);
      setSessionId(session.id);
      setGameState(session.state);
    });

    socket.on(SocketMessage.UPDATE, setGameState);

    return () => {
      socket.off(SocketMessage.UPDATE);
      socket.off(SocketMessage.WELCOME);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    if (isAdmin) {
      return navigate(`/admin/${sessionId}`);
    }
  }, [isAdmin, sessionId]);

  if (!gameState) return null;

  return (
    <div>
      <NavBar />

      {gameState.started ? <GameView /> : <Players />}
    </div>
  );
};
