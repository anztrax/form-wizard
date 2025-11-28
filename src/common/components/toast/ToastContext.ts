import { createContext } from "react";

export type ToastType = "info" | "success" | "error" | "warning";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  durationInMs?: number;
}

export type ShowToastOptions = {
  message: string;
  type?: ToastType;
  durationInMs?: number;
};

export type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
