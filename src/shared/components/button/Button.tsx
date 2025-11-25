"use client";

import React from "react";
import styles from "./button.module.css";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}


export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled,
    className,
    ...rest
  } = props;

  const classes = [
    styles["button"],
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth ? styles["button--full-width"] : "",
    disabled ? styles["button--disabled"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled}
      {...rest}
    >
      <span className={styles["button__content"]}>{children}</span>
    </button>
  );
}
