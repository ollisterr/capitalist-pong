import { Link } from "react-router-dom";
import styled from "styled-components";

import { useAppState } from "../providers/AppStateProvider";
import { Body } from "../styles";
import { GradientBlock } from "./GradientBlock";

export const NavBar = () => {
  const { playerName, gameState } = useAppState();

  return (
    <Wrapper>
      <ContentWrapper>
        <Link to="/">
          <Body color="primaryDark">CapitalistPong</Body>
        </Link>

        {gameState?.started && (
          <Body>
            Now in turn:{" "}
            <strong>
              {gameState.turn === playerName ? "YOU" : gameState.turn}
            </strong>
          </Body>
        )}
      </ContentWrapper>

      <GradientBlock height="xs" />
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  width: 100vw;
  box-shadow: ${(p) => p.theme.shadow.lg};
  flex: 0;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${(p) => p.theme.spacing.default};
  width: 100%;
  padding: ${(p) => p.theme.spacing.default} ${(p) => p.theme.spacing.md};
  background-color: ${(p) => p.theme.colors.white};
`;
