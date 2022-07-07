import styled, { css } from "styled-components";

const BaseText = styled.span<{ bold?: boolean; fade?: boolean }>`
  font-size: 1rem;
  ${(p) =>
    p.bold !== undefined &&
    css`
      font-weight: ${p.bold ? "bold" : "normal"};
    `}
  color: ${(p) => p.theme.colors.black};
  ${(p) => p.fade && "opacity: 0.5;"}
`;

export const Title = styled(BaseText).attrs({ as: "h3" })`
  font-size: 1.6rem;
  letter-spacing: 1px;
`;

export const Body = styled(BaseText)``;
