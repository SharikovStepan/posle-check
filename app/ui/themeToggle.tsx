"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // 👉 инициализация
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;

    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = systemDark ? "dark" : "light";

      setTheme(initial);
      applyTheme(initial);
    }
  }, []);

  // 👉 применение темы
  const applyTheme = (theme: Theme) => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  // 👉 переключение
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  if (!theme) return null;

  return (
    <button onClick={toggleTheme} className="px-4 py-2 rounded-lg bg-surface border border-border hover:bg-surface-hover transition">
      {theme === "dark" ? "🌙 Тёмная" : "☀️ Светлая"}
    </button>
  );
}
