const express = require("express");
const Bill = require("../models/Bill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 GET today's sales (OWNER ONLY)
router.get("/today", authMiddleware, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const bills = await Bill.find({
      owner: req.owner._id, // 🔑 IMPORTANT
      createdAt: { $gte: startOfDay },
    });

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    res.json({
      totalSales,
      billCount: bills.length,
      bills,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
