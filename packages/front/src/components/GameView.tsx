import styled from "styled-components";
import { Stack } from "styled-layout";

import { isAdminState, useAppState } from "../providers/AppStateProvider";
import { Title } from "../styles";
import { ConfirmButton } from "./ConfirmButton";
import { Shop } from "./Shop";

export const GameView = () => {
  const { gameState, playerName } = useAppState();

  const nextTurn = () => console.log("Next");

  if (!gameState || isAdminState(gameState)) return null;

  return (
    <Wrapper>
      <Stack axis="x">
        <Title>Cash available: </Title>

        <Title bold={false}>${gameState.state.cash}</Title>
      </Stack>

      <Shop />

      <ConfirmButton
        onClick={nextTurn}
        disabled={!gameState.turn || gameState.turn !== playerName}
      />
    </Wrapper>
  );
};

const Wrapper = styled(Stack)`
  padding: ${(p) => p.theme.spacing.default};
`;
