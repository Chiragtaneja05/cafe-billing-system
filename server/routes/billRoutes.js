const express = require("express");
const Bill = require("../models/Bill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 CREATE bill (OWNER-LINKED)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // ✅ 1. Extract customer details from request body
    const { items, paymentMethod, customerName, customerPhone } = req.body;

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const bill = new Bill({
      items,
      totalAmount,
      paymentMethod,
      customerName, // ✅ 2. Add Name to database object
      customerPhone, // ✅ 3. Add Phone to database object
      owner: req.owner._id,
    });

    const savedBill = await bill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔒 GET bills (OWNER ONLY)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bills = await Bill.find({
      owner: req.owner._id,
    }).sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
