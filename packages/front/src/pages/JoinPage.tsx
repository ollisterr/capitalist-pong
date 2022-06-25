import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../providers/AppStateProvider";

export const JoinPage = () => {
  const navigate = useNavigate();

  const [gameId, setGameId] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    navigate(`/game/${gameId}`, { state: { playerName: nickname } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Game ID:
          <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
        </label>

        <label>
          Nickname:
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>

        <button type="submit">Join</button>
      </form>

      <Link to="/create">Create game</Link>
    </div>
  );
};
