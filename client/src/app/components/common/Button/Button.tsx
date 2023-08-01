"use client";

import { CSSProperties } from "react";

import { SMALL_BUTTON_FONT_SIZE } from "@/constants";
import {
  ButtonProps as Web3ButtonProps,
  Button as Web3Button,
} from "@web3uikit/core";

type ButtonProps = Web3ButtonProps & {
  fontSize?: number;
  style?: CSSProperties;
};

const Button = (props: ButtonProps): JSX.Element => (
  <Web3Button
    {...props}
    style={{
      fontSize: props.fontSize ?? SMALL_BUTTON_FONT_SIZE,
      ...props.style,
    }}
  />
);

export default Button;
