const express = require("express");
const Bill = require("../models/Bill");
const Menu = require("../models/Menu"); // ✅ Import Menu Model
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 CREATE bill (OWNER-LINKED)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // 1. Extract details
    const { items, paymentMethod, customerName, customerPhone } = req.body;

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    // 2. Create the Bill
    const bill = new Bill({
      items,
      totalAmount,
      paymentMethod,
      customerName,
      customerPhone,
      owner: req.owner._id,
    });

    const savedBill = await bill.save();

    // ✅ 3. INVENTORY UPDATE: Subtract Stock
    // Loop through sold items and decrease stock in Menu collection
    for (const item of items) {
      if (item._id) {
        // Find menu item by ID and decrease stock
        await Menu.findByIdAndUpdate(item._id, {
          $inc: { stock: -item.quantity }, // Negative number reduces stock
        });
      }
    }

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
