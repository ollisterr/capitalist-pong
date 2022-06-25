import styled from "styled-components";
import { useAppState } from "../providers/AppStateProvider";
import { Body } from "../styles";

export const NavBar = () => {
  const { playerName, playerState, isAdmin } = useAppState();

  return (
    <Wrapper>
      <Body>CapitalistPong</Body>

      {playerName && (
        <>
          <Body bold>{playerName}</Body>

          {!isAdmin && <Body>{playerState?.cash} €</Body>}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto auto;
  width: 100%;
  padding: ${(p) => p.theme.spacing.default} ${(p) => p.theme.spacing.md};
  box-shadow: ${(p) => p.theme.shadow.default};
  background-color: ${(p) => p.theme.colors.white};
`;
