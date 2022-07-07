import styled from "styled-components";

export const Button = styled.button`
  border-radius: ${(p) => p.theme.borderRadius.full};
  background: linear-gradient(
    to bottom,
    ${(p) => p.theme.colors.primary},
    ${(p) => p.theme.colors.primaryDark}
  );
  border: none;
  color: ${(p) => p.theme.colors.white};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  font-weight: 900;
  letter-spacing: 2px;
  box-shadow: ${(p) => p.theme.shadow.default};
  cursor: pointer;
`;

export const Page = styled.main``;

export const Row = styled.div`
  display: flex;
  width: 100%;
  gap: ${(p) => p.theme.spacing.default};
  align-items: center;
  padding: ${(p) => p.theme.spacing.default} ${(p) => p.theme.spacing.md};
  border-top: 1px solid ${(p) => p.theme.colors.lightestGrey};
`;
