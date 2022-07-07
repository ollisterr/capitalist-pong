import { SocketRequest } from "@shared/message";
import styled from "styled-components";
import { Stack } from "styled-layout";
import { socket } from "../config/socket.config";

import { isAdminState, useAppState } from "../providers/AppStateProvider";
import { Title } from "../styles";
import { ConfirmButton } from "./ConfirmButton";
import { Shop } from "./Shop";

export const GameView = () => {
  const {
    gameState,
    playerName,
    shoppingCart,
    resetShoppingCart,
    shoppingCartValue,
  } = useAppState();

  const nextTurn = () => {
    console.log("> NEXT TURN");
    resetShoppingCart();
    socket.emit(SocketRequest.NEXT_TURN, shoppingCart);
    // reset shopping cart
  };

  if (!gameState || isAdminState(gameState)) return null;

  return (
    <Wrapper>
      <Stack axis="x">
        <Title>Cash available: </Title>

        <Title>${gameState.state.cash - shoppingCartValue}</Title>

        {shoppingCartValue !== 0 && (
          <Title fade bold={false}>
            (${-shoppingCartValue})
          </Title>
        )}
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
