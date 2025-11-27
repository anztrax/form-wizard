"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "../components/toast/Toast";
import { ThemeProvider } from "./theme";
import { LoadingModalProvider } from "../components/modal";

export function AppProviders(props: PropsWithChildren) {
  const {
    children
  } = props;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <LoadingModalProvider>
            {children}
          </LoadingModalProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
