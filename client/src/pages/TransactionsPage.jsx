import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { TransactionTable } from "../components/transactions/TransactionTable.jsx";
import { AddTransactionModal } from "../components/transactions/AddTransactionModal.jsx";
import { Plus } from "lucide-react";
import { useTransactions } from "../context/TransactionContext.jsx";
import { Loader } from "../components/ui/Loader.jsx";

export const TransactionsPage = () => {
  const { loading } = useTransactions();
  const [open, setOpen] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Transactions
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Search, filter and manage your money history.
            </p>
          </div>
          <button
            className="btn btn-primary text-xs inline-flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus size={14} />
            Add transaction
          </button>
        </div>

        {loading && <Loader label="Fetching latest transactions" />}

        <TransactionTable />

        <AddTransactionModal open={open} onClose={() => setOpen(false)} />
      </div>
    </AppLayout>
  );
};

