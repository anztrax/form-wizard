"use client";

import React from "react";
import styles from "./InputText.module.css";

type InputTextSize = "sm" | "md" | "lg";

export type InputTextProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputTextSize;
  hasError?: boolean;
  fullWidth?: boolean;
}

export function InputText(props: InputTextProps) {
  const {
    size = "md",
    hasError = false,
    fullWidth = false,
    className,
    type = "text",
    ...rest
  } = props;

  const classes = [
    styles["input"],
    styles[`input--${size}`],
    hasError ? styles["input--error"] : "",
    fullWidth ? styles["input--full-width"] : "",
    className,
  ].filter(Boolean)
    .join(" ");

  return (
    <input
      type={type}
      className={classes}
      {...rest}
    />
  );
}
