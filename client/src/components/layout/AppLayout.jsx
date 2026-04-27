import React from "react";
import { Sidebar } from "./Sidebar.jsx";
import { Navbar } from "./Navbar.jsx";

export const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col max-w-full">
        <Navbar />
        <main className="flex-1 px-4 md:px-8 py-5 md:py-7 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

