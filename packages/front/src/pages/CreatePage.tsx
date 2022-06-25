import { useState } from "react";

export const CreatePage = () => {
  const [gameId, setGameId] = useState("");

  return (
    <div>
      <form>
        <label>
          Game ID:
          <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
