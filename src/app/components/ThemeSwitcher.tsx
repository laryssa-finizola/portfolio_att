"use client";

import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button className="theme-switch" type="button" aria-label="Alternar tema claro/escuro" title="Alternar tema claro/escuro"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      <span className="theme-icon-light" aria-hidden="true">☼</span>
      <span className="theme-icon-dark" aria-hidden="true">☾</span>
    </button>
  );
}
