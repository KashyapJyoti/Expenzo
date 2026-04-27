import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Transaction.deleteMany({});
    await User.deleteMany({});

    console.log("Creating sample user...");
    const user = await User.create({
      name: "Demo User",
      email: "demo@expenzo.com",
      password: "password123",
    });

    const userId = user._id;

    console.log("Creating sample transactions...");
    const now = new Date();
    const monthsBack = (n) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - n);
      return d;
    };

    const sampleTransactions = [
      {
        userId,
        type: "income",
        amount: 80000,
        category: "Salary",
        description: "Monthly salary",
        date: monthsBack(0),
      },
      {
        userId,
        type: "expense",
        amount: 15000,
        category: "Rent",
        description: "Apartment rent",
        date: monthsBack(0),
      },
      {
        userId,
        type: "expense",
        amount: 6000,
        category: "Groceries",
        description: "Monthly groceries",
        date: monthsBack(0),
      },
      {
        userId,
        type: "income",
        amount: 78000,
        category: "Salary",
        description: "Last month salary",
        date: monthsBack(1),
      },
      {
        userId,
        type: "expense",
        amount: 14000,
        category: "Rent",
        description: "Apartment rent",
        date: monthsBack(1),
      },
      {
        userId,
        type: "expense",
        amount: 5000,
        category: "Food & Dining",
        description: "Eating out",
        date: monthsBack(1),
      },
      {
        userId,
        type: "income",
        amount: 75000,
        category: "Salary",
        description: "Two months ago salary",
        date: monthsBack(2),
      },
      {
        userId,
        type: "expense",
        amount: 12000,
        category: "Rent",
        description: "Apartment rent",
        date: monthsBack(2),
      },
      {
        userId,
        type: "expense",
        amount: 8000,
        category: "Shopping",
        description: "Clothes & accessories",
        date: monthsBack(2),
      },
      {
        userId,
        type: "expense",
        amount: 3000,
        category: "Transport",
        description: "Cab & fuel",
        date: monthsBack(2),
      },
    ];

    await Transaction.insertMany(sampleTransactions);

    console.log("Seed data created successfully.");
    console.log("Login credentials:");
    console.log("Email: demo@expenzo.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();

