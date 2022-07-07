import { Link } from "react-router-dom";
import styled from "styled-components";
import { Stack } from "styled-layout";

import { isAdminState, useAppState } from "../providers/AppStateProvider";
import { Body } from "../styles";

export const NavBar = () => {
  const { playerName, isAdmin, gameState } = useAppState();

  return (
    <Wrapper>
      <Link to="/">
        <Body>CapitalistPong</Body>
      </Link>

      {gameState?.started && (
        <>
          <Body>Now in turn: {gameState.turn}</Body>{" "}
        </>
      )}

      {!isAdminState(gameState) && (
        <Stack axis="x" spacing="default">
          <Body bold>{playerName}</Body>

          {!isAdmin && <Body>{gameState?.state.cash} €</Body>}
        </Stack>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${(p) => p.theme.spacing.default};
  width: 100%;
  padding: ${(p) => p.theme.spacing.default} ${(p) => p.theme.spacing.md};
  box-shadow: ${(p) => p.theme.shadow.default};
  background-color: ${(p) => p.theme.colors.white};
`;
