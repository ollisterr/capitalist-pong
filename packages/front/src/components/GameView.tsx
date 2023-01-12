import { SocketRequest } from "@shared/message";
import styled from "styled-components";
import { Stack } from "styled-layout";

import { socket } from "../config/socket.config";
import { isAdminState, useAppState } from "../providers/AppStateProvider";
import { ConfirmButton } from "./ConfirmButton";
import { Shop } from "./Shop";

export const GameView = () => {
  const { gameState, playerName, shoppingCart, resetShoppingCart } =
    useAppState();

  const nextTurn = () => {
    socket.emit(SocketRequest.NEXT_TURN, shoppingCart);
    resetShoppingCart();
  };

  if (!gameState || isAdminState(gameState)) return null;

  return (
    <Wrapper>
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
  padding-top: ${(p) => p.theme.spacing.xl};
`;
