import styled from "styled-components";
import { Spacer, Stack } from "styled-layout";

import { useAppState } from "../providers/AppStateProvider";
import { Body, Row, Title } from "../styles";

export const Players = () => {
  const { gameState } = useAppState();

  if (!gameState) return null;

  return (
    <Wrapper>
      <ListTitle>Players</ListTitle>

      <Spacer />

      <ListWrapper>
        {gameState.state.length > 0 ? (
          gameState.state.map((player, i) => (
            <Row>
              <Body>{i + 1}. </Body>
              <Body bold>{player.name}</Body>
            </Row>
          ))
        ) : (
          <EmptyList>No players yet</EmptyList>
        )}
      </ListWrapper>
    </Wrapper>
  );
};

const ListTitle = styled(Title)`
  padding: ${(p) => p.theme.spacing.default};
`;

const Wrapper = styled.div`
  padding-top: ${(p) => p.theme.spacing.xl};
  width: 100%;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: center;
  width: 100%;
  padding: ${(p) => p.theme.spacing.default};
  padding-bottom: ${(p) => p.theme.spacing.xxl};
  align-items: center;
`;

const EmptyList = styled(Body)`
  width: 100%;
  text-align: center;
  color: ${(p) => p.theme.colors.lightGrey};
`;
