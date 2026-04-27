import React from "react";

export const Loader = ({ label = "Loading" }) => {
  return (
    <div className="flex items-center justify-center py-10 text-xs text-slate-400 gap-2">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>{label}...</span>
    </div>
  );
};

