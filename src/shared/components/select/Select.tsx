"use client";

import React from "react";
import styles from "./select.module.css";

export type SelectSize = "sm" | "md" | "lg";

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  size?: SelectSize;
  hasError?: boolean;
  fullWidth?: boolean;
}

export function Select(props: SelectProps) {
  const {
    size = "md",
    hasError = false,
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const wrapperClasses = [
    styles["select"],
    styles[`select--${size}`],
    hasError ? styles["select--error"] : "",
    fullWidth ? styles["select--full-width"] : "",
    className,
  ].filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      <select
        className={styles["select__control"]}
        {...rest}
      >
        {children}
      </select>
      <span className={styles["select__icon"]}>▾</span>
    </div>
  );
}
