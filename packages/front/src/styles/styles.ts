import { Link as ReactLink } from "react-router-dom";
import styled from "styled-components";
import { gradientStyle } from "../components/GradientBlock";

export const Button = styled.button`
  border-radius: ${(p) => p.theme.borderRadius.full};
  background-color: ${(p) => p.theme.colors.primary};
  border: none;
  color: ${(p) => p.theme.colors.white};
  padding: ${(p) => p.theme.spacing.default} ${(p) => p.theme.spacing.lg};
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 2px;
  box-shadow: ${(p) => p.theme.shadow.default};
  cursor: pointer;
  ${(p) => p.disabled && "opacity: 0.5;"}
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
  font-family: "Montserrat", sans-serif;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.primary};
`;

export const Input = styled.input`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.black};
  border: none;
  font-family: inherit;
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.borderRadius.sm};
  background-color: ${(p) => p.theme.colors.lightestGrey};
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
  gap: ${(p) => p.theme.spacing.default};
  align-items: center;
  padding: ${(p) => p.theme.spacing.default} ${(p) => p.theme.spacing.md};
  border-top: 1px solid ${(p) => p.theme.colors.lightestGrey};
`;

export const Page = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: ${(p) => p.theme.spacing.default};
  padding-top: ${(p) => p.theme.spacing.xl};
  color: ${(p) => p.theme.colors.black};
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;

  &:after {
    content: "";
    ${gradientStyle}
    width: 100%;
    height: ${(p) => p.theme.spacing.md};
    animation-delay: 500ms;
  }
`;

export const Link = styled(ReactLink)`
  color: ${(p) => p.theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
