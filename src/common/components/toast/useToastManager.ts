import { useCallback, useState } from "react";
import { ToastItem, ShowToastOptions } from "./ToastContext";

let globalToastId = 1;

export function useToastManager(defaultDurationInMs: number) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = (options: ShowToastOptions) => {
    const id = globalToastId++;
    const toast: ToastItem = {
      id,
      type: options.type ?? "info",
      message: options.message,
      durationInMs: options.durationInMs ?? defaultDurationInMs,
    };
    setToasts((prev) => [...prev, toast]);

    if (toast.durationInMs && toast.durationInMs > 0) {
      window.setTimeout(() => removeToast(id), toast.durationInMs);
    }
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
}
