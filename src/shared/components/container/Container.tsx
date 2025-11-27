"use client";

import { PropsWithChildren } from "react";
import classNames from "classnames";
import styles from "./Container.module.css";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export type ContainerProps = {
  size?: ContainerSize;
  className?: string;
}

export function Container(props: PropsWithChildren<ContainerProps>) {
  const {
    size = "xl",
    className = "",
    children
  } = props;
  const baseClassName  = "container";

  const cls = classNames(
    styles[baseClassName],
    styles[`${baseClassName}--${size}`],
    className,
  );

  return (
    <div className={cls}>
      {children}
    </div>
  );
};
