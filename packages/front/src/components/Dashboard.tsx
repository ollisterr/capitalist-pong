import { useAppState } from "../providers/AppStateProvider";
import { Players } from "./Players";

export const Dashboard = () => {
  const { gameState } = useAppState();

  if (!gameState) return null;

  return <div>{gameState.started ? <div /> : <Players />}</div>;
};
