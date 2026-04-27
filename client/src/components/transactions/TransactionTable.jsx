import React, { useMemo, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext.jsx";
import { formatCurrency } from "../../utils/currency.js";

const categories = [
  "All",
  "Salary",
  "Rent",
  "Groceries",
  "Food & Dining",
  "Shopping",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];

export const TransactionTable = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    return (transactions || []).filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (category !== "All" && tx.category !== category) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          tx.description?.toLowerCase().includes(s) ||
          tx.category?.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [transactions, search, type, category]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      setDeletingId(id);
      await deleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card-muted">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
            <Search size={16} strokeWidth={1.8} />
          </span>
          <input
            className="input h-10 rounded-full pl-14 text-xs placeholder:text-slate-400"
            placeholder="Search description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-xs">
          <select
            className="input h-9 text-xs max-w-[120px]"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="input h-9 text-xs max-w-[160px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto text-xs">
        <table className="min-w-full text-left">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
            <tr>
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Category</th>
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium text-right">Amount</th>
              <th className="py-2 pl-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => {
              const d = new Date(tx.date);
              const dateStr = d.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <tr
                  key={tx._id}
                  className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-900/60 dark:hover:bg-slate-900/60"
                >
                  <td className="py-2 pr-3">{dateStr}</td>
                  <td className="py-2 pr-3">
                    <span className="badge bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-slate-700 dark:text-slate-300">
                    {tx.description || "-"}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <span
                      className={
                        tx.type === "income" ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      {tx.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="py-2 pl-3 text-right">
                    <button
                      className="text-slate-500 hover:text-red-400"
                      onClick={() => handleDelete(tx._id)}
                      disabled={deletingId === tx._id}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!filtered.length && (
          <p className="text-center text-xs text-slate-500 py-6">
            No transactions match your filters yet.
          </p>
        )}
      </div>
    </div>
  );
};

