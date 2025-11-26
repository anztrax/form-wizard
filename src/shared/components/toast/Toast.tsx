"use client";

import {
  PropsWithChildren,
} from "react";
import classNames from "classnames";
import { ToastContext } from "./ToastContext";
import { useToastManager } from "./useToastManager";
import styles from "./toast.module.css";

export type {
  ToastType,
  ToastItem,

  ShowToastOptions
} from './ToastContext';
export { useToast } from "./useToast";
export interface ToastProviderProps {
  defaultDurationInMs?: number;
}

export function ToastProvider(props: PropsWithChildren<ToastProviderProps>) {
  const {
    children,
    defaultDurationInMs = 3000
  } = props;

  const { toasts, showToast, removeToast } = useToastManager(defaultDurationInMs);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className={styles["toast"]}>
        <div className={styles["toast__list"]}>
          {toasts.map((toast) => {
            const itemClassNames = classNames(
              styles["toast__item"],
              styles[`toast__item--type-${toast.type}`]
            );

            return (
              <div
                key={toast.id}
                className={itemClassNames}
              >
                <div className={styles["toast__content"]}>
                  <span className={styles["toast__icon"]}>
                    {toast.type === "success" && "✅"}
                    {toast.type === "error" && "❌"}
                    {toast.type === "warning" && "⚠️"}
                    {toast.type === "info" && "ℹ️"}
                  </span>
                  <span className={styles["toast__message"]}>
                    {toast.message}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles["toast__close"]}
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </ToastContext.Provider>
  );
};
