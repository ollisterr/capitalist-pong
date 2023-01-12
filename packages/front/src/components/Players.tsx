import styled from "styled-components";
import { Spacer } from "styled-layout";

import { isAdminState, useAppState } from "../providers/AppStateProvider";
import { Body, Row, Title } from "../styles";

export const Players = () => {
  const { gameState } = useAppState();

  if (!gameState) return null;

  return (
    <Wrapper>
      <Title labeled>Players</Title>

      <Spacer />

      <ListWrapper>
        {gameState.standings.length > 0 ? (
          gameState.standings.map((player, i) => (
            <Row key={player.name}>
              <Body>{i + 1}. </Body>
              <Body bold>{player.name}</Body>

              {isAdminState(gameState) &&
                gameState.state.find((x) => player.name === x.name)
                  ?.offline && <Body>OFFLINE</Body>}
            </Row>
          ))
        ) : (
          <EmptyList>No players yet</EmptyList>
        )}
      </ListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 200px;
  padding: ${(p) => p.theme.spacing.default};
  padding-bottom: ${(p) => p.theme.spacing.xxl};
  align-items: center;
`;

const EmptyList = styled(Body)`
  width: 100%;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  color: ${(p) => p.theme.colors.lightGrey};
`;
