import { useState } from "react";
import { Link } from "react-router-dom";

export const JoinPage = () => {
  const [gameId, setGameId] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    alert(gameId);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Game ID:
          <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
        </label>

        <button type="submit">Join</button>
      </form>

      <Link to="/create">Create game</Link>
    </div>
  );
};
