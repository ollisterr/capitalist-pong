import styled, { css } from "styled-components";
import { Color } from "./theme";
import { nonNullable } from "../utils/common.utils";

export const BaseText = styled.span<{
  bold?: boolean;
  fade?: boolean;
  color?: Color;
}>`
  color: ${(p) => (p.color ? p.theme.colors[p.color] : "inherit")};
  font-size: 1.2rem;
  text-decoration: none;
  ${(p) =>
    nonNullable(p.bold) &&
    css`
      font-weight: ${p.bold ? "bold" : "normal"};
    `}
  ${(p) => p.fade && "opacity: 0.5;"}
`;

export const Title = styled(BaseText).attrs({ as: "h3" })<{
  labeled?: boolean;
}>`
  position: relative;
  font-size: 1.6rem;
  letter-spacing: 1px;
  z-index: 2;
  margin-bottom: ${(p) => p.theme.spacing.sm};

  ${(p) =>
    p.labeled &&
    css`
      &:before {
        content: "";
        position: absolute;
        left: -${(p) => p.theme.spacing.sm};
        bottom: -30%;
        z-index: -1;
        width: 10rem;
        border-radius: ${(p) => p.theme.borderRadius.sm};
        height: ${(p) => p.theme.spacing.md};
        background: linear-gradient(
          45deg,
          ${(p) => p.theme.colors.lightestGrey},
          white
        );
        mix-blend-mode: overlay;
      }
    `}
`;

export const Body = styled(BaseText)``;
