"use client";

import { BUTTON_FONT_SIZE } from "@/constants";
import { ButtonProps, Button as Web3Button } from "@web3uikit/core";

const Button = (props: ButtonProps & { fontSize?: number }): JSX.Element => (
  <Web3Button
    {...props}
    style={{ fontSize: props.fontSize ?? BUTTON_FONT_SIZE }}
  />
);

export default Button;
