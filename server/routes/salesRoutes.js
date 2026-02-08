const express = require("express");
const Bill = require("../models/Bill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 GET sales with date filter
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { range } = req.query; // 'today', 'week', 'month'
    const startDate = new Date();

    // Logic to calculate start date
    if (range === "week") {
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Default: Today (Start of today)
      startDate.setHours(0, 0, 0, 0);
    }

    // Find bills after the start date
    const bills = await Bill.find({
      owner: req.owner._id,
      createdAt: { $gte: startDate },
    });

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    res.json({
      totalSales,
      billCount: bills.length,
      range,
      startDate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
