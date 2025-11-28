"use client";

import React, { useState, useCallback, ReactNode } from "react";
import { LoadingModalContext } from "./LoadingModalContext";
import { LoadingModal } from "./LoadingModal";

export type LoadingModalProviderProps = {
  children: ReactNode;
};

export function LoadingModalProvider({ children }: LoadingModalProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setMessage(undefined);
  }, []);

  return (
    <LoadingModalContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <LoadingModal isOpen={isLoading} message={message} />
    </LoadingModalContext.Provider>
  );
}
