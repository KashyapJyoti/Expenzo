import React from "react";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export const StatsCard = ({ label, value, helper, tone = "default" }) => {
  const icon =
    tone === "income"
      ? <ArrowUpRight size={16} />
      : tone === "expense"
      ? <ArrowDownRight size={16} />
      : <Wallet size={16} />;

  const badgeClasses =
    tone === "income"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40"
      : tone === "expense"
      ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/40"
      : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700";

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${badgeClasses}`}
        >
          {icon}
        </span>
      </div>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        {value}
      </p>
      {helper && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
};

