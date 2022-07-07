import styled, { css } from "styled-components";

const BaseText = styled.span<{ bold?: boolean }>`
  font-size: 1rem;
  ${(p) =>
    p.bold !== undefined &&
    css`
      font-weight: ${p.bold ? "bold" : "normal"};
    `}
  color: ${(p) => p.theme.colors.black};
`;

export const Title = styled(BaseText).attrs({ as: "h3", bold: true })`
  font-size: 1.6rem;
  letter-spacing: 1px;
`;

export const Body = styled(BaseText)``;
