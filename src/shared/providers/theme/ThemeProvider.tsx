"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { ThemeContext, ThemeMode, ResolvedTheme } from "./ThemeContext";
import "./theme.css";

const THEME_STORAGE_KEY = "app-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "auto") {
      return stored;
    }
  } catch (error) {
    console.error("Failed to read theme from localStorage:", error);
  }
  return "auto";
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    if (theme === "auto") {
      return getSystemTheme();
    }

    return theme;
  });

  useEffect(() => {
    if (theme === "auto") {
      const updateSystemTheme = () => {
        setResolvedTheme(getSystemTheme());
      };

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateSystemTheme);

      updateSystemTheme();

      return () => {
        mediaQuery.removeEventListener("change", updateSystemTheme);
      };
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);


  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
