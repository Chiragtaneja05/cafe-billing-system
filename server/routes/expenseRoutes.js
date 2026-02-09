const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 ADD EXPENSE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const newExpense = new Expense({
      owner: req.owner._id,
      title,
      amount,
      category,
      date: date || Date.now(),
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 GET EXPENSES (Sorted by Newest)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ owner: req.owner._id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 DELETE EXPENSE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      owner: req.owner._id,
    });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
