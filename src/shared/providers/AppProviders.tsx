"use client";

import { PropsWithChildren } from "react";
import { ToastProvider } from "../components/toast/Toast";
import { ThemeProvider } from "./theme";

export function AppProviders(props: PropsWithChildren) {
  const {
    children
  } = props;

  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
