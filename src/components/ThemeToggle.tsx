"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-glass-border transition-all hover:bg-primary/10 hover:text-primary"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={20} className="animate-in fade-in zoom-in duration-300" />
      ) : (
        <Moon size={20} className="animate-in fade-in zoom-in duration-300" />
      )}
    </motion.button>
  );
}
