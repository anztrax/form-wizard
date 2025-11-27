import { useContext } from "react";
import { LoadingModalContext } from "./LoadingModalContext";

export const useLoadingModal = () => {
  const ctx = useContext(LoadingModalContext);
  if (!ctx) {
    throw new Error("useLoadingModal must be used inside LoadingModalProvider");
  }
  return ctx;
};
