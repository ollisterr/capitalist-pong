import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GameState } from "@shared/types";
import { SocketMessage, SocketRequest } from "@shared/message";

import { socket } from "../config/socket.config";
import storageUtils from "../utils/storage.utils";
import { useAppState } from "../providers/AppStateProvider";
import { NavBar } from "../components/NavBar";

export const AdminPage = () => {
  const params = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { setUser, setSessionId, sessionId } = useAppState();

  const [gameState, setGameState] = useState<GameState>();

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

  return (
    <div>
      <NavBar />
      <br />
      {JSON.stringify(gameState) || "Ei mitään näytettävää"}
    </div>
  );
};
