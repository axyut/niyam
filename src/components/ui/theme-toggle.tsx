"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, theme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or nothing on the server to avoid mismatch
    return (
      <div className="p-2 h-[2.2rem] w-[2.2rem]" /> // A placeholder with same size
    );
  }

  return (
    <button
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
