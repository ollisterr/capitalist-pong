import { useAppState } from "../providers/AppStateProvider";

export const NavBar = () => {
  const { playerName, playerId } = useAppState();

  return (
    <div>
      {playerName} – ({playerId})
    </div>
  );
};
