import React from "react";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { useTransactions } from "../context/TransactionContext.jsx";
import { formatCurrency } from "../utils/currency.js";
import { StatsCard } from "../components/ui/StatsCard.jsx";
import { CategoryDoughnut } from "../components/charts/CategoryDoughnut.jsx";
import { Loader } from "../components/ui/Loader.jsx";

export const DashboardPage = () => {
  const { dashboard, transactions, loading, error } = useTransactions();

  const recent = (transactions || []).slice(0, 5);

  if (loading && !dashboard) {
    return (
      <AppLayout>
        <Loader label="Loading your dashboard" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Overview
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Clean snapshot of your income, expenses and balance.
            </p>
          </div>
          {dashboard && (
            <p className="text-[11px] text-slate-500">
              Based on{" "}
              <span className="text-slate-300 font-medium">
                {dashboard.totalTransactions}
              </span>{" "}
              tracked transactions.
            </p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            label="Total Income"
            value={formatCurrency(dashboard?.totalIncome || 0)}
            tone="income"
          />
          <StatsCard
            label="Total Expenses"
            value={formatCurrency(dashboard?.totalExpenses || 0)}
            tone="expense"
          />
          <StatsCard
            label="Balance"
            value={formatCurrency(dashboard?.balance || 0)}
            helper={
              dashboard?.balance >= 0
                ? "Nice, you're net positive this period."
                : "You're spending more than you earn this period."
            }
          />
          <StatsCard
            label="Total Transactions"
            value={dashboard?.totalTransactions || 0}
            helper="Higher volume gives Expenzo better insights."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">
                Category-wise expenses
              </h2>
              <p className="text-[11px] text-slate-500">
                Where your money actually goes
              </p>
            </div>
            <CategoryDoughnut
              data={dashboard?.categoryWiseBreakdown || {}}
            />
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Monthly comparison</h2>
              <p className="text-[11px] text-slate-500">
                Last month vs this month
              </p>
            </div>
            {dashboard?.lastMonthComparison?.hasData ? (
              <MonthlyComparison comparison={dashboard.lastMonthComparison} />
            ) : (
              <p className="text-xs text-slate-500">
                Add transactions across multiple months to unlock this view.
              </p>
            )}
          </div>
        </div>

          <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recent transactions</h2>
            <p className="text-[11px] text-slate-500">
              Last {recent.length || 0} activity items
            </p>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                <tr>
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Category</th>
                  <th className="py-2 pr-3 font-medium">Description</th>
                  <th className="py-2 pr-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => {
                  const d = new Date(tx.date);
                  const dateStr = d.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  });
                  return (
                    <tr
                      key={tx._id}
                      className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-900/60 dark:hover:bg-slate-900/60"
                    >
                      <td className="py-2 pr-3">{dateStr}</td>
                      <td className="py-2 pr-3 text-slate-700 dark:text-slate-300">
                        {tx.category}
                      </td>
                      <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">
                        {tx.description || "-"}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        <span
                          className={
                            tx.type === "income"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {tx.type === "income" ? "+" : "-"}{" "}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!recent.length && (
              <p className="text-center text-xs text-slate-500 py-6">
                No transactions yet. Add your first income or expense.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const MonthlyComparison = ({ comparison }) => {
  const { currentMonth, previousMonth, incomeChange, expenseChange } =
    comparison;

  if (!currentMonth) {
    return (
      <p className="text-xs text-slate-500">
        Add transactions in the current month to see movements.
      </p>
    );
  }

  const incomeImproved = incomeChange > 0;
  const expenseImproved = expenseChange < 0;

  return (
    <div className="space-y-3 text-xs">
      <p className="text-slate-500 dark:text-slate-400">
        Comparing{" "}
        <span className="text-slate-800 font-medium dark:text-slate-200">
          {currentMonth}
        </span>{" "}
        vs{" "}
        <span className="text-slate-600 dark:text-slate-300">
          {previousMonth || "previous period"}
        </span>
        .
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card-muted bg-slate-50 border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            Income change
          </p>
          <p
            className={
              incomeImproved
                ? "text-emerald-500 font-semibold dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-300"
            }
          >
            {incomeChange > 0 ? "+" : ""}
            {formatCurrency(incomeChange || 0)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
            {incomeImproved
              ? "You're earning more this month than last."
              : "Income is flat or slightly down vs last month."}
          </p>
        </div>
        <div className="card-muted bg-slate-50 border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            Expense change
          </p>
          <p
            className={
              expenseImproved
                ? "text-emerald-500 font-semibold dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
            }
          >
            {expenseChange > 0 ? "+" : ""}
            {formatCurrency(expenseChange || 0)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
            {expenseImproved
              ? "Spending is trending down. Keep going."
              : "Spending is higher or flat vs last month."}
          </p>
        </div>
      </div>
    </div>
  );
};

