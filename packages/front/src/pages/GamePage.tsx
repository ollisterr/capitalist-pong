import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SocketMessage } from "@shared/message";

import { socket } from "../config/socket.config";
import { useAppState } from "../providers/AppStateProvider";
import { NavBar, Players } from "../components";
import { GameView } from "../components/GameView";
import { Page, PageWrapper } from "../styles";
import { GameStateHeader } from "../components/GameStateHeader";

export const GamePage = () => {
  const navigate = useNavigate();
  const params = useParams<{ sessionId: string }>();

  const {
    playerId,
    sessionId,
    setSessionId,
    gameState,
    setGameState,
    isAdmin,
  } = useAppState();

  useEffect(() => {
    // navigate to front page if the session is invalid
    if (!params.sessionId || !playerId) {
      return navigate("/");
    }

    if (sessionId !== params.sessionId) {
      setSessionId(params.sessionId);
    }

    if (isAdmin) {
      return navigate(`/admin/${sessionId}`);
    }
  }, [sessionId, params.sessionId]);

  useEffect(() => {
    socket.on(SocketMessage.UPDATE, setGameState);

    return () => {
      socket.off(SocketMessage.UPDATE);
      socket.off(SocketMessage.WELCOME);
    };
  }, []);

  if (!gameState) return null;

  return (
    <Page>
      {gameState.started && <GameStateHeader />}

      {gameState.started ? <GameView /> : <Players />}
    </Page>
  );
};
