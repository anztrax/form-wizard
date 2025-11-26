"use client";

import { useTheme } from "../../providers/theme";
import { Button } from "../button/Button";
import styles from "./themeSwitcher.module.css";

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      return;
    }

    if (theme === "dark") {
      setTheme("auto");
      return;
    }

    setTheme("light");
  };

  const getIcon = () => {
    if (theme === "auto") {
      return "🌓";
    }
    return resolvedTheme === "dark" ? "🌙" : "☀️";
  };

  const getLabel = () => {
    if (theme === "auto") {
      return `Auto (${resolvedTheme})`;
    }
    return theme === "dark" ? "Dark" : "Light";
  };

  const labelText = getLabel();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className={styles["theme-switcher"]}
      aria-label={`Switch theme. Current: ${labelText}`}
      title={`Theme: ${labelText}`}
    >
      <span className={styles["theme-switcher__icon"]}>
        {getIcon()}
      </span>
      <span className={styles["theme-switcher__label"]}>
        {labelText}
      </span>
    </Button>
  );
}
