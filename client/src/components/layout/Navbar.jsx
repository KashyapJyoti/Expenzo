import React from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { MoonStar, SunMedium } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export const Navbar = () => {
  const { dark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="h-16 border-b border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between px-4 md:px-6 bg-slate-50/70 dark:bg-slate-950/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
        <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1" />
        <span>Today</span>
        <span className="text-slate-700 dark:text-slate-300">{today}</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold dark:bg-slate-800 dark:text-slate-100">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {user.name || "Expenzo User"}
              </span>
              <span className="text-slate-500 dark:text-slate-500">
                {user.email}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle color mode"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-amber-500 dark:bg-slate-800 dark:text-emerald-300">
            {dark ? <SunMedium size={14} /> : <MoonStar size={14} />}
          </span>
          <span>{dark ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
    </header>
  );
};

