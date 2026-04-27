import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryDoughnut = ({ data }) => {
  const labels = Object.keys(data || {});
  const values = Object.values(data || {});

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#22c55e",
          "#06b6d4",
          "#a855f7",
          "#f97316",
          "#e11d48",
          "#22d3ee",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { color: "#cbd5f5" },
      },
    },
    cutout: "70%",
  };

  if (!labels.length) {
    return (
      <div className="text-center text-xs text-slate-500 py-8">
        Not enough data yet. Add a few expenses to see category insights.
      </div>
    );
  }

  return <Doughnut data={chartData} options={options} />;
};

