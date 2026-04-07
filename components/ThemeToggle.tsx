"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  function toggleTheme() {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  }
  return null;

  // return (
  //   <button
  //     onClick={toggleTheme}
  //     className="rounded-full p-3 shadow hover:scale-110 transition bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
  //   >
  //     {isDark ? "🌙" : "☀️"}
  //   </button>
  // );
}
