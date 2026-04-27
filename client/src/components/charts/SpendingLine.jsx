import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const SpendingLine = ({ monthlyTrend }) => {
  const labels = (monthlyTrend || []).map((m) => m.month);
  const balances = (monthlyTrend || []).map((m) => m.balance);

  const data = {
    labels,
    datasets: [
      {
        label: "Net Savings",
        data: balances,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.25)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
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
        Not enough data yet to see your trend.
      </div>
    );
  }

  return <Line data={data} options={options} />;
};

