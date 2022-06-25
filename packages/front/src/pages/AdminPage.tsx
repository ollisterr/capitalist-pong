import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Commodity, GameState } from "@shared/types";
import { SocketMessage, SocketRequest } from "@shared/message";

import { socket } from "../config/socket.config";
import storageUtils from "../utils/storage.utils";
import { useAppState } from "../providers/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Shop } from "../components/Shop";
import { Page } from "../styles";
import { Dashboard } from "../components/Dashboard";

export const AdminPage = () => {
  const params = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { setUser, setSessionId, sessionId, setGameState, gameState } =
    useAppState();

  useEffect(() => {
    const adminToken = storageUtils.getAdminToken();

    if (!params.sessionId || !adminToken) {
      return navigate("/");
    }

    if (params.sessionId !== sessionId) {
      setSessionId(params.sessionId);
    }

    socket.emit(SocketRequest.ADMIN_JOIN, {
      sessionId: params.sessionId,
      adminToken,
    });

    socket.on(SocketMessage.WELCOME, ({ user, session }) => {
      setUser(user);
      setSessionId(session.id);
      setGameState(session.state);
    });

    socket.on(SocketMessage.UPDATE, setGameState);

    return () => {
      socket.off(SocketMessage.UPDATE);
    };
  }, [params.sessionId]);

  const purchase = (commodity: Commodity) => {
    socket.emit(SocketRequest.PURCHASE, commodity);
  };

  if (!gameState) return null;

  return (
    <Page>
      <NavBar />

      <Dashboard />

      <Shop prices={gameState.prices} purchase={purchase} />
    </Page>
  );
};
