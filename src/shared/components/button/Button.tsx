"use client";

import React from "react";
import styles from "./button.module.css";
import classNames from "classnames";

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

  const classes = classNames(
    styles["button"],
    styles[`button--${variant}`],
    styles[`button--${size}`],
    {
      [styles["button--full-width"]]: fullWidth,
      [styles["button--disabled"]]: disabled,
    },
    className
  );

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
