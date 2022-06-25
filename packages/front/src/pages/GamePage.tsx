import { GameState } from "@shared/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../config/socket.config";

export const GamePage = () => {
  const params = useParams<{ room: string }>();

  const [gameState, setGameState] = useState<GameState>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const roomId = params["room"];

    socket.emit("newConnection", roomId);

    socket.on("message", setGameState);

    socket.on("invalidSession", setError);

    return () => {
      socket.off("message");
    };
  }, [params]);

  return (
    <div>
      {JSON.stringify(gameState) || "Ei mitään näytettävää"}
      <br />
      {error}
    </div>
  );
};
