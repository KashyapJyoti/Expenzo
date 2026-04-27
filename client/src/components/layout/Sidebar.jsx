import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  PieChart,
  Lightbulb,
  User2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ListChecks },
  { to: "/charts", label: "Charts", icon: PieChart },
  { to: "/tips", label: "Tips", icon: Lightbulb },
  { to: "/profile", label: "Profile", icon: User2 },
];

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-50/90 border-r border-slate-200/80 backdrop-blur-xl dark:bg-slate-950/90 dark:border-slate-800/80">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
          <span className="text-emerald-500 dark:text-emerald-400 font-bold text-lg">₹</span>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
            Expenzo
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Smart expense insights</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50",
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="btn btn-outline w-full justify-between text-xs"
        >
          <span className="flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

