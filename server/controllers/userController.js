import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { getDashboardSummary } from "./dashboardController.js";

const buildUserPayload = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  // eslint-disable-next-line no-unused-vars
  const { password, __v, ...safe } = user;
  safe.id = safe._id;
  return safe;
};

const computeBudgetStatus = async (userId, monthlyBudget) => {
  const budget = Number(monthlyBudget) || 0;
  if (!budget) {
    return {
      budget,
      totalExpensesThisMonth: 0,
      usedPercent: 0,
      remaining: 0,
      exceeded: false,
      monthLabel: null,
    };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const expenses = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: "expense",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpensesThisMonth = expenses[0]?.total || 0;
  const usedPercent = budget ? Math.min(100, (totalExpensesThisMonth / budget) * 100) : 0;
  const remaining = Math.max(0, budget - totalExpensesThisMonth);

  return {
    budget,
    totalExpensesThisMonth,
    usedPercent,
    remaining,
    exceeded: totalExpensesThisMonth > budget,
    monthLabel: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  };
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = buildUserPayload(user);
    const budgetStatus = await computeBudgetStatus(user._id, user.monthlyBudget);

    return res.json({ user: profile, budgetStatus });
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, monthlyBudget, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (monthlyBudget !== undefined && monthlyBudget !== null) {
      const parsed = Number(monthlyBudget);
      user.monthlyBudget = Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    const profile = buildUserPayload(user);
    const budgetStatus = await computeBudgetStatus(user._id, user.monthlyBudget);

    return res.json({ user: profile, budgetStatus, message: "Profile updated" });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (avatar !== undefined && typeof avatar !== "string") {
      return res.status(400).json({ message: "Avatar must be a string URL" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatar || "" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = buildUserPayload(user);
    const budgetStatus = await computeBudgetStatus(user._id, user.monthlyBudget);

    return res.json({ user: profile, budgetStatus, message: "Avatar updated" });
  } catch (error) {
    console.error("Update avatar error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

