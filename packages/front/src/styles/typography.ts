import styled from "styled-components";

export const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 1px;
`;

export const Body = styled.span<{ bold?: boolean }>`
  font-size: 1rem;
  ${(p) => p.bold && "font-weight: bold;"}
  color: ${(p) => p.theme.colors.black};
`;
