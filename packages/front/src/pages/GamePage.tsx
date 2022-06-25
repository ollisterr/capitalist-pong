import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Commodity } from "@shared/types";

import { socket } from "../config/socket.config";
import { SocketMessage, SocketRequest } from "@shared/message";
import { useAppState } from "../providers/AppStateProvider";
import { NavBar } from "../components/NavBar";
import storageUtils from "../utils/storage.utils";
import { Shop } from "../components/Shop";
import { Dashboard } from "../components/Dashboard";

export const GamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ sessionId: string }>();

  const {
    playerId,
    setUser,
    sessionId,
    setSessionId,
    setError,
    gameState,
    setGameState,
  } = useAppState();

  useEffect(() => {
    if (!params.sessionId) {
      return navigate("/");
    }

    if (sessionId !== params.sessionId) {
      setSessionId(params.sessionId);
    }

    if (!sessionId) return;

    const adminToken = storageUtils.getAdminToken();
    if (adminToken) {
      return navigate(`/admin/${sessionId}`);
    }

    if (playerId) {
      socket.emit(SocketRequest.REJOIN, { sessionId, playerId });
    } else if ((location.state as any)?.playerName) {
      socket.emit(SocketRequest.JOIN, {
        sessionId,
        playerName: (location.state as any)?.playerName,
      });
    } else {
      navigate("/");
    }

    socket.on(SocketMessage.WELCOME, ({ user, session }) => {
      setUser(user);
      setSessionId(session.id);
      setGameState(session.state);
    });

    socket.on(SocketMessage.UPDATE, setGameState);
    socket.on(SocketMessage.ERROR, (error) => {
      setError(error);
      navigate("/");
    });

    return () => {
      socket.off(SocketMessage.UPDATE);
    };
  }, [sessionId, params.sessionId]);

  const purchase = (commodity: Commodity) => {
    socket.emit(SocketRequest.PURCHASE, commodity);
  };

  if (!gameState) return null;

  return (
    <div>
      <NavBar />

      <Dashboard />

      <Shop prices={gameState?.prices} purchase={purchase} />
    </div>
  );
};
