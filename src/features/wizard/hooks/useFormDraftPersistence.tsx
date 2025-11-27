import { useEffect, useRef } from "react";
import {
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "@/shared/lib/localStorageUtils";

type UseFormDraftPersistenceParams<T extends FieldValues> = {
  form: UseFormReturn<T>;
  roleType: string;
  storageKeyPrefix?: string;
  debounceMs?: number;
  initialValues?: Partial<T>;
};

type UseFormDraftPersistenceReturn = {
  storageKey: string;
  clearDraft: () => void;
  clearDraftAndReset: () => void;
};

export function useFormDraftPersistence<T extends FieldValues>(
  params: UseFormDraftPersistenceParams<T>
): UseFormDraftPersistenceReturn {
  const {
    form,
    roleType,
    storageKeyPrefix = "employee_form_draft",
    debounceMs = 2000,
    initialValues,
  } = params;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { reset, getValues, subscribe } = form;
  const storageKey = `${storageKeyPrefix}_${roleType}`;



  useEffect(() => {
    const savedDraft = getLocalStorage<T>(storageKey);
    if (savedDraft) {
      reset(savedDraft, { keepDefaultValues: true });
    }
  }, [storageKey]);

  useEffect(() => {
    const unsubscribe = subscribe({
      callback: () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          const formValues = getValues();
          setLocalStorage(storageKey, formValues);
        }, debounceMs);
      },
    });

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [storageKey, debounceMs]);

  const clearDraft = () => {
    removeLocalStorage(storageKey);
  }

  const clearDraftAndReset = () => {
    clearDraft();
    reset((initialValues ?? {}) as T);
  }

  return {
    storageKey,
    clearDraft,
    clearDraftAndReset,
  };
}
