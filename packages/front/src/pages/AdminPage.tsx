import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SocketMessage, SocketRequest } from "@shared/message";

import { socket } from "../config/socket.config";
import storageUtils from "../utils/storage.utils";
import { useAppState } from "../providers/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Page } from "../styles";
import { ConfirmButton, Players } from "../components";
import { Spacer } from "styled-layout";

export const AdminPage = () => {
  const params = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { setSessionId, sessionId, playerId, setGameState, gameState } =
    useAppState();

  useEffect(() => {
    const adminToken = storageUtils.getAdminToken();

    if (!params.sessionId || !adminToken) {
      return navigate("/");
    }

    if (params.sessionId !== sessionId) {
      setSessionId(params.sessionId);
    }
  }, []);

  useEffect(() => {
    socket.on(SocketMessage.ADMIN_UPDATE, setGameState);

    return () => {
      socket.off(SocketMessage.ADMIN_UPDATE);
      socket.off(SocketMessage.ADMIN_WELCOME);
    };
  }, [params.sessionId]);

  if (!gameState) return <div>No game state</div>;

  const startGame = () => {
    if (!playerId || !sessionId) return;
    socket.emit(SocketRequest.START_GAME, { sessionId });
  };

  const nextTurn = () => {
    socket.emit(SocketRequest.NEXT_TURN, { investments: {}, commodities: [] });
  };

  return (
    <Page>
      <Players />

      <Spacer size="xl" />

      <ConfirmButton onClick={gameState.started ? nextTurn : startGame} />
    </Page>
  );
};
