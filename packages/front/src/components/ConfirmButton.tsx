import { useState } from "react";
import styled, { css } from "styled-components";
import { Button as DefaultButton } from "../styles";

const buttonTexts = {
  default: "Ready?",
  confirm: "Confirm",
  disabled: "Waiting for turn...",
} as const;

type ButtonState = keyof typeof buttonTexts;

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export const ConfirmButton = ({ onClick, disabled = false }: Props) => {
  const [state, setState] = useState<ButtonState>("default");

  const confirm = () => {
    onClick();
    setState("default");
  };

  return (
    <Button
      isReady={state === "confirm"}
      onClick={state === "confirm" ? confirm : () => setState("confirm")}
      disabled={disabled}
    >
      {disabled ? buttonTexts.disabled : buttonTexts[state]}
    </Button>
  );
};

const Button = styled(DefaultButton)<{ isReady: boolean; disabled: boolean }>`
  ${(p) =>
    p.disabled &&
    css`
      background: ${p.theme.colors.lightGrey};
    `}
  ${(p) =>
    p.isReady &&
    css`
      background: ${p.theme.colors.success};
    `}
`;
