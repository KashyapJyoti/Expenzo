import { Transaction } from "../models/Transaction.js";

const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId }).sort({
      date: 1,
    });

    const now = new Date();
    const currentMonthKeyActual = getMonthKey(now);

    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryWiseAllTime = {};
    const categoryWiseCurrentMonth = {};
    const monthlyTotals = {};

    for (const tx of transactions) {
      const amt = tx.amount;
      const monthKey = getMonthKey(tx.date);

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { income: 0, expense: 0 };
      }

      if (tx.type === "income") {
        monthlyTotals[monthKey].income += amt;
      } else if (tx.type === "expense") {
        monthlyTotals[monthKey].expense += amt;

        const cat = tx.category || "Other";
        if (!categoryWiseAllTime[cat]) categoryWiseAllTime[cat] = 0;
        // All-time category-wise breakdown
        categoryWiseAllTime[cat] += amt;
      }

      // For top-level totals we only consider the current calendar month
      if (monthKey === currentMonthKeyActual) {
        if (tx.type === "income") {
          totalIncome += amt;
        } else if (tx.type === "expense") {
          totalExpenses += amt;
          // For current-month pie chart breakdown, also track per-category
          const cat = tx.category || "Other";
          if (!categoryWiseCurrentMonth[cat]) categoryWiseCurrentMonth[cat] = 0;
          categoryWiseCurrentMonth[cat] += amt;
        }
      }
    }

    const balance = totalIncome - totalExpenses;

    const monthKeys = Object.keys(monthlyTotals).sort();
    const len = monthKeys.length;

    const currentMonthKey = len > 0 ? monthKeys[len - 1] : null;
    const previousMonthKey = len > 1 ? monthKeys[len - 2] : null;

    const current = currentMonthKey ? monthlyTotals[currentMonthKey] : null;
    const previous = previousMonthKey ? monthlyTotals[previousMonthKey] : null;

    const lastMonthComparison = {
      currentMonth: currentMonthKey,
      previousMonth: previousMonthKey,
      incomeChange:
        current && previous
          ? current.income - previous.income
          : null,
      expenseChange:
        current && previous
          ? current.expense - previous.expense
          : null,
      hasData: !!current,
    };

    const monthlyTrend = monthKeys.map((key) => ({
      month: key,
      income: monthlyTotals[key].income,
      expense: monthlyTotals[key].expense,
      balance: monthlyTotals[key].income - monthlyTotals[key].expense,
    }));

    return res.json({
      totalIncome,
      totalExpenses,
      balance,
      totalTransactions: transactions.length,
      lastMonthComparison,
      // Current month breakdown (what dashboard cards use)
      categoryWiseBreakdown: Object.keys(categoryWiseCurrentMonth).length
        ? categoryWiseCurrentMonth
        : categoryWiseAllTime,
      // All-time breakdown (for charts page)
      categoryWiseBreakdownAllTime: categoryWiseAllTime,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

