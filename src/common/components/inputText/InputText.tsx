"use client";

import React, { forwardRef } from "react";
import styles from "./InputText.module.css";
import classNames from "classnames";

type InputTextSize = "sm" | "md" | "lg";

export type InputTextProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputTextSize;
  hasError?: boolean;
  fullWidth?: boolean;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
  const {
    size = "md",
    hasError = false,
    fullWidth = false,
    className = '',
    type = "text",
    ...rest
  } = props;

  const classes = classNames(
    styles["input"],
    styles[`input--${size}`],
    {
      [styles["input--error"]]: hasError,
      [styles["input--full-width"]]: fullWidth,
    },
    className,
  );

  return (
    <input
      ref={ref}
      type={type}
      className={classes}
      {...rest}
    />
  );
});

InputText.displayName = "InputText";
