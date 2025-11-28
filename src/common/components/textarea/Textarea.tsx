"use client";

import React from "react";
import styles from "./textarea.module.css";
import classNames from "classnames";

type TextareaSize = "sm" | "md" | "lg";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: TextareaSize;
  hasError?: boolean;
  fullWidth?: boolean;
}

export function Textarea(props: TextareaProps) {
  const {
    size = "md",
    hasError = false,
    fullWidth = false,
    className = "",
    ...rest
  } = props;

  const classes = classNames(
    styles["textarea"],
    styles[`textarea--${size}`],
    {
      [styles["textarea--error"]]: hasError,
      [styles["textarea--full-width"]]: fullWidth,
    },
    className
  );

  return <textarea className={classes} {...rest} />;
}
