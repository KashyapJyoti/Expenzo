import { Transaction } from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const { category, type, search, limit } = req.query;

    const query = { userId: req.user._id };

    if (category) query.category = category;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let mongoQuery = Transaction.find(query).sort({ date: -1, createdAt: -1 });
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
        mongoQuery = mongoQuery.limit(parsedLimit);
      }
    }

    const transactions = await mongoQuery.exec();
    return res.json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category || !date) {
      return res
        .status(400)
        .json({ message: "Type, amount, category and date are required" });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      description: description || "",
      date: new Date(date),
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Create transaction error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (category) transaction.category = category;
    if (description !== undefined) transaction.description = description;
    if (date) transaction.date = new Date(date);

    await transaction.save();

    return res.json(transaction);
  } catch (error) {
    console.error("Update transaction error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Delete transaction error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

