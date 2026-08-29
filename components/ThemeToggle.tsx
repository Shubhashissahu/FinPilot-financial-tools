"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" || theme === "dark" ? "light" : "dark")}
      suppressHydrationWarning
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-neutral-800 active:scale-95"
      aria-label="Toggle theme"
      title="Toggle color theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 text-amber-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 text-emerald-400 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}


