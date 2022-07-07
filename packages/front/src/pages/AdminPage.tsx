import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AdminGameState } from "@shared/types";
import { SocketMessage, SocketRequest } from "@shared/message";

import { socket } from "../config/socket.config";
import storageUtils from "../utils/storage.utils";
import { useAppState } from "../providers/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Page } from "../styles";
import { ConfirmButton, Players } from "../components";

export const AdminPage = () => {
  const params = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const {
    setUser,
    setSessionId,
    sessionId,
    playerId,
    setGameState,
    gameState,
  } = useAppState();

  useEffect(() => {
    socket.connect();
    const adminToken = storageUtils.getAdminToken();

    if (!params.sessionId || !adminToken) {
      return navigate("/");
    }

    if (params.sessionId !== sessionId) {
      setSessionId(params.sessionId);
    }

    socket.on(SocketMessage.ADMIN_WELCOME, ({ user, session }) => {
      setUser(user);
      storageUtils.setAdminToken(user.id);
      setSessionId(session.id);
      setGameState(session.state);
    });

    socket.on(SocketMessage.ADMIN_UPDATE, setGameState);

    return () => {
      socket.off(SocketMessage.ADMIN_UPDATE);
      socket.off(SocketMessage.ADMIN_WELCOME);
      socket.disconnect();
    };
  }, [params.sessionId]);

  if (!gameState) return <div>No game state</div>;

  const startGame = () => {
    if (!playerId || !sessionId) return;
    socket.emit(SocketRequest.START_GAME, { sessionId });
  };

  return (
    <Page>
      <NavBar />

      <Players />

      {!gameState.started && <ConfirmButton onClick={startGame} />}
    </Page>
  );
};
