"use client";

import { PropsWithChildren } from "react";
import { ToastProvider } from "../components/toast/Toast";

export function AppProviders(props: PropsWithChildren) {
  const {
    children
  } = props;

  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
