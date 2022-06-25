import { useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import api from "../api";
import storageUtils from "../utils/storage.utils";

export const CreatePage = () => {
  const navigate = useNavigate();

  const [gameId, setGameId] = useState("");
  const [error, setError] = useState<string>();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (gameId.length > 0) {
      api
        .createGame(gameId)
        .then(({ data }) => {
          storageUtils.setAdminToken(data.adminToken);
          storageUtils.setSession(data.id);
          navigate(`/admin/${data.id}`);
        })
        .catch((e) => setError(e.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Game ID:
          <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
          {error && <span>{error}</span>}
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
