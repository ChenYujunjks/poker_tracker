"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 或者 return <div className="w-[XXpx] h-[XXpx]" /> 作为占位

  const opposite = theme === "dark" ? "light" : "dark";

  return (
    <button
      onClick={() => setTheme(opposite)}
      className="rounded-lg border px-3 py-1 text-sm transition
                 hover:bg-[#a7f3d0] hover:text-zinc-900 dark:hover:bg-[#34d399]/30"
    >
      {opposite === "dark" ? "💡 Light" : "🌙 Dark"}
    </button>
  );
}
