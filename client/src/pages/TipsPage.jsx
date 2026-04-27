import React, { useMemo } from "react";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { useTransactions } from "../context/TransactionContext.jsx";
import { formatCurrency } from "../utils/currency.js";
import { Lightbulb, TrendingDown, TrendingUp } from "lucide-react";

export const TipsPage = () => {
  const { dashboard } = useTransactions();

  const tips = useMemo(() => deriveTips(dashboard), [dashboard]);

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Smart tips
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Behaviour-based nudges to keep your money flow healthy.
            </p>
          </div>
        </div>

        {!dashboard && (
          <p className="text-xs text-slate-500">
            Track a few months of income and expenses to unlock personalised
            tips.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4 flex gap-3 items-start shadow-sm dark:bg-slate-900/70 dark:border-slate-800"
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                  tip.type === "good"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : tip.type === "warning"
                    ? "bg-amber-500/15 text-amber-300"
                    : "bg-red-500/15 text-red-300"
                }`}
              >
                {tip.icon}
              </div>
              <div>
                <p className="text-sm font-medium mb-1 text-slate-800 dark:text-slate-50">
                  {tip.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {tip.body}
                </p>
                {tip.footer && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
                    {tip.footer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card border-dashed border-emerald-200 bg-emerald-50 flex gap-3 dark:border-emerald-500/40 dark:bg-emerald-500/5">
          <Lightbulb className="text-emerald-500 mt-0.5 dark:text-emerald-300" size={16} />
          <div>
            <p className="text-xs font-semibold text-emerald-600 mb-1 dark:text-emerald-200">
              50 / 30 / 20 rule
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-100/80">
              As a thumb rule, try to keep{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-200">
                50% of your income for needs
              </span>
              ,{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-200">
                30% for wants
              </span>{" "}
              and at least{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-200">
                20% for savings & investments
              </span>
              . Use your Expenzo categories to loosely map into these buckets.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const deriveTips = (summary) => {
  if (!summary) return [];

  const tips = [];
  const trend = summary.monthlyTrend || [];
  const len = trend.length;
  const last = len ? trend[len - 1] : null;
  const prev = len > 1 ? trend[len - 2] : null;

  if (last && prev) {
    const savingsChange = last.balance - prev.balance;
    if (savingsChange > 0) {
      tips.push({
        type: "good",
        title: "Your savings increased month-over-month",
        body: `You saved ${formatCurrency(
          savingsChange
        )} more than the previous month. That's exactly how compounding starts.`,
        footer:
          "Try to keep this positive savings habit consistent for at least 6-12 months.",
        icon: <TrendingUp size={16} />,
      });
    } else if (savingsChange < 0) {
      tips.push({
        type: "alert",
        title: "Savings dipped this month",
        body: `Your net savings fell by ${formatCurrency(
          Math.abs(savingsChange)
        )} compared to last month.`,
        footer:
          "Look at 1–2 categories you can trim by 10–15% rather than doing drastic cuts.",
        icon: <TrendingDown size={16} />,
      });
    }

    const expenseChange = last.expense - prev.expense;
    if (expenseChange < 0) {
      tips.push({
        type: "good",
        title: "Spending decreased vs last month",
        body: `Your total spend is lower by ${formatCurrency(
          Math.abs(expenseChange)
        )}. This is the cleanest way to boost savings without increasing income.`,
        icon: <TrendingDown size={16} />,
      });
    }
  }

  const income = summary.totalIncome || 0;
  const expenses = summary.totalExpenses || 0;
  if (income > 0) {
    const savings = income - expenses;
    const savingsRate = savings / income;

    if (savingsRate < 0.1) {
      tips.push({
        type: "alert",
        title: "You're saving less than 10% of your income",
        body: `Currently your approximate savings rate is around ${Math.round(
          savingsRate * 100
        )}% of your income. That's low for long-term stability.`,
        footer:
          "Try to first aim for 15–20% savings rate using the 50/30/20 rule as a mental model.",
        icon: <TrendingDown size={16} />,
      });
    } else if (savingsRate >= 0.2) {
      tips.push({
        type: "good",
        title: "You're at or above the 20% savings rule",
        body: `Your savings rate looks healthy at roughly ${Math.round(
          savingsRate * 100
        )}% of your income.`,
        footer:
          "If this feels sustainable, consider directing a part of this towards diversified investments.",
        icon: <TrendingUp size={16} />,
      });
    }
  }

  if (!tips.length) {
    tips.push({
      type: "good",
      title: "You're in a stable zone",
      body: "Your income and spending look reasonably balanced. Keep tracking for a few more months for sharper, category-level tips.",
      icon: <Lightbulb size={16} />,
    });
  }

  return tips;
};

