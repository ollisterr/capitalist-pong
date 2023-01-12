import styled, { css, keyframes } from "styled-components";
import { Spacing } from "../styles/theme";

export const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const gradientStyle = css`
  background: linear-gradient(
    -75deg,
    ${(p) => p.theme.colors.primaryDark},
    ${(p) => p.theme.colors.primaryLight},
    ${(p) => p.theme.colors.success}
  );
  background-size: 600%;
  animation: ${gradientFlow} 30s ease infinite;
`;

export const GradientBlock = styled.div<{ width?: Spacing; height?: Spacing }>`
  ${gradientStyle}
  width: ${(p) => (p.width ? p.theme.spacing[p.width] : "100%")};
  height: ${(p) => (p.height ? p.theme.spacing[p.height] : "100%")};
`;
