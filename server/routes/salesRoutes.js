const express = require("express");
const Bill = require("../models/Bill");
const Expense = require("../models/Expense"); // ✅ 1. Import Expense Model
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 GET sales stats & Profit (Supports: today, week, month, custom)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { range, from, to } = req.query;

    // We need a common date filter to apply to both Bills and Expenses
    let dateFilter = {};

    // 📅 DATE LOGIC
    if (range === "custom" && from && to) {
      // Custom Range
      const startDate = new Date(from);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);

      dateFilter = {
        $gte: startDate,
        $lte: endDate,
      };
    } else {
      // Standard Ranges (Today, Week, Month)
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      if (range === "week") {
        startDate.setDate(startDate.getDate() - 7);
      } else if (range === "month") {
        startDate.setMonth(startDate.getMonth() - 1);
      }

      dateFilter = { $gte: startDate };
    }

    // 🔍 1. Fetch Bills (Sales)
    const bills = await Bill.find({
      owner: req.owner._id,
      createdAt: dateFilter, // Bills use 'createdAt'
    }).sort({ createdAt: -1 });

    // 🔍 2. Fetch Expenses (Costs)
    const expenses = await Expense.find({
      owner: req.owner._id,
      date: dateFilter, // Expenses use 'date'
    });

    // 🧮 3. Calculate Totals
    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const netProfit = totalSales - totalExpenses;

    res.json({
      totalSales,
      totalExpenses, // ✅ Send Total Cost
      netProfit, // ✅ Send Net Profit
      billCount: bills.length,
      bills,
      range,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
