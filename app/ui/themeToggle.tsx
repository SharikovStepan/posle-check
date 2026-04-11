"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

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

  //   if (!theme) return null;

  return (
    <button onClick={toggleTheme} className={`relative px-4 py-2 w-35 h-10 rounded-lg bg-bg-tertiary border border-border hover:bg-surface-hover transition`}>
      <AnimatePresence>
        <div className="absolute top-1/2 left-1/2 -translate-1/2 flex justify-center items-center w-full">
          {theme === "dark" ? (
            <motion.p key={"dark"} initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
              {"☀️ Светлая"}
            </motion.p>
          ) : (
            <motion.p key={"light"} initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
              {"🌙 Тёмная"}
            </motion.p>
          )}
        </div>
      </AnimatePresence>
    </button>
  );
}
