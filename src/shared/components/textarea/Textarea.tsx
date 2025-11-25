"use client";

import React, { forwardRef } from "react";
import styles from "./textarea.module.css";

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

  const classes = [
    styles["textarea"],
    styles[`textarea--${size}`],
    hasError ? styles["textarea--error"] : "",
    fullWidth ? styles["textarea--full-width"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <textarea className={classes} {...rest} />;
}
