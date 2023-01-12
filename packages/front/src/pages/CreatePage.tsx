import { useState } from "react";

import { SocketRequest } from "@shared/message";
import { socket } from "../config/socket.config";
import { Page } from "../styles";

export const CreatePage = () => {
  const [gameId, setGameId] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (gameId.length > 3) {
      console.log("Creating session...");
      socket.emit(SocketRequest.CREATE, { id: gameId });
    }
  };

  return (
    <Page>
      <form onSubmit={handleSubmit}>
        <label>
          Game ID:
          <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
        </label>

        <button type="submit">Submit</button>
      </form>
    </Page>
  );
};
