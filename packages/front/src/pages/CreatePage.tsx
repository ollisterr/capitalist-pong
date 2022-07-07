import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SocketRequest } from "@shared/message";
import { socket } from "../config/socket.config";

export const CreatePage = () => {
  const navigate = useNavigate();

  const [gameId, setGameId] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (gameId.length > 3) {
      navigate(`/admin/${gameId}`);
      socket.emit(SocketRequest.CREATE, { id: gameId });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Game ID:
          <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
