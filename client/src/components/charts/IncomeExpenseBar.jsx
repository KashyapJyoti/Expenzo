import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const IncomeExpenseBar = ({ monthlyTrend }) => {
  const labels = (monthlyTrend || []).map((m) => m.month);
  const incomes = (monthlyTrend || []).map((m) => m.income);
  const expenses = (monthlyTrend || []).map((m) => m.expense);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomes,
        backgroundColor: "#22c55e",
        borderRadius: 8,
      },
      {
        label: "Expenses",
        data: expenses,
        backgroundColor: "#ef4444",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#cbd5f5" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148,163,184,0.15)" },
      },
    },
  };

  if (!labels.length) {
    return (
      <div className="text-center text-xs text-slate-500 py-8">
        Not enough data yet to show monthly income vs expenses.
      </div>
    );
  }

  return <Bar data={data} options={options} />;
};

