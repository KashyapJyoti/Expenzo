import React from "react";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { useTransactions } from "../context/TransactionContext.jsx";
import { CategoryDoughnut } from "../components/charts/CategoryDoughnut.jsx";
import { IncomeExpenseBar } from "../components/charts/IncomeExpenseBar.jsx";
import { SpendingLine } from "../components/charts/SpendingLine.jsx";
import { Loader } from "../components/ui/Loader.jsx";

export const ChartsPage = () => {
  const { dashboard, loading } = useTransactions();

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Charts
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Visual patterns for income, expenses and savings.
            </p>
          </div>
        </div>

        {loading && <Loader label="Preparing your charts" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="text-sm font-semibold mb-3">
              Category-wise spend (all time)
            </h2>
            <CategoryDoughnut
              data={dashboard?.categoryWiseBreakdownAllTime || dashboard?.categoryWiseBreakdown || {}}
            />
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold mb-3">
              Income vs expenses per month
            </h2>
            <IncomeExpenseBar monthlyTrend={dashboard?.monthlyTrend || []} />
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold mb-3">
            Net savings trend
          </h2>
          <SpendingLine monthlyTrend={dashboard?.monthlyTrend || []} />
        </div>
      </div>
    </AppLayout>
  );
};

