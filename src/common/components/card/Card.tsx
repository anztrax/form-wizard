import { CSSProperties, PropsWithChildren } from "react";
import styles from "./card.module.css";

export type CardProps = {
  className?: string;
  style?: CSSProperties;
}

export function Card(props: PropsWithChildren<CardProps>) {
  const {
    children,
    className = "",
    style
  } = props;

  return (
    <div
      className={`${styles.card} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
