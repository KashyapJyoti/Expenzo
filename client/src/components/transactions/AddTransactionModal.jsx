import React, { useState } from "react";
import { X } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext.jsx";

const defaultForm = {
  type: "expense",
  amount: "",
  category: "Groceries",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

const categories = [
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

export const AddTransactionModal = ({ open, onClose }) => {
  const { addTransaction } = useTransactions();
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeToggle = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addTransaction({
        ...form,
        amount: Number(form.amount),
      });
      setForm(defaultForm);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card max-w-md w-full relative">
        <button
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-slate-400 mb-2">Type</p>
            <div className="inline-flex rounded-xl bg-slate-900/70 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => handleTypeToggle("expense")}
                className={`px-3 py-1.5 text-xs rounded-lg ${
                  form.type === "expense"
                    ? "bg-expense text-white"
                    : "text-slate-300"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeToggle("income")}
                className={`px-3 py-1.5 text-xs rounded-lg ${
                  form.type === "income"
                    ? "bg-income text-white"
                    : "text-slate-300"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="input"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input"
              placeholder="Optional note"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs min-w-[90px]"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

