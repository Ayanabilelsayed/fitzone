"use client";

import { useEffect, useSyncExternalStore } from "react";

const THEME_EVENT = "theme-change";

function subscribe(callback) {
  window.addEventListener(THEME_EVENT, callback);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const shouldUseDark = savedTheme === "dark";

    document.documentElement.classList.toggle(
      "dark",
      shouldUseDark
    );

    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = () => {
    const newTheme = !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");

    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 text-[var(--text)] shadow-sm transition-all hover:border-[var(--primary)]"
    >
      {isDark ? (
        <svg
          className="h-5 w-5 text-[var(--primary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-[var(--text-secondary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}