import styled from "styled-components";

import { isAdminState, useAppState } from "../providers/AppStateProvider";
import { BaseText, Title } from "../styles";
import { GradientBlock } from "./GradientBlock";

export const GameStateHeader = () => {
  const { shoppingCartValue, gameState } = useAppState();

  if (!gameState || isAdminState(gameState)) return null;

  return (
    <GradientWrapper>
      <ContentWrapper>
        <TopTitle color="white">
          <span>Cash available: </span>

          <span>${gameState.state.cash - shoppingCartValue}</span>

          {shoppingCartValue !== 0 && (
            <BaseText fade bold={false} color="white">
              (${-shoppingCartValue})
            </BaseText>
          )}
        </TopTitle>
      </ContentWrapper>
    </GradientWrapper>
  );
};

const GradientWrapper = styled(GradientBlock)`
  width: 100%;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  padding: ${(p) => p.theme.spacing.xl} ${(p) => p.theme.spacing.default};
  padding-top: 7rem;
  margin: 0 auto;
  color: white;
`;

const TopTitle = styled(Title)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.default};
`;
