import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [txRes, dashRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/dashboard/summary"),
      ]);
      setTransactions(txRes.data);
      setDashboard(dashRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [token]);

  const addTransaction = async (payload) => {
    const res = await api.post("/transactions", payload);
    setTransactions((prev) => [res.data, ...prev]);
    await refreshDashboard();
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    await refreshDashboard();
  };

  const updateTransaction = async (id, payload) => {
    const res = await api.put(`/transactions/${id}`, payload);
    setTransactions((prev) =>
      prev.map((t) => (t._id === id ? res.data : t))
    );
    await refreshDashboard();
    return res.data;
  };

  const refreshDashboard = async () => {
    const res = await api.get("/dashboard/summary");
    setDashboard(res.data);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        dashboard,
        loading,
        error,
        fetchAll,
        addTransaction,
        deleteTransaction,
        updateTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);

