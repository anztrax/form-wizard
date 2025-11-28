import { createContext } from "react";

export type LoadingModalContextValue = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
};

export const LoadingModalContext = createContext<LoadingModalContextValue | undefined>(undefined);
