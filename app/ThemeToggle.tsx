"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    // Force light theme mode and clean any dark preference
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.removeItem("polaris-theme");
    }
  }, []);

  return null;
}