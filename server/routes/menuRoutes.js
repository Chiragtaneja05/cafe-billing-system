const express = require("express");
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Debug Log
console.log("✅ Menu Routes Loaded");

// ==========================================
// 🔓 PUBLIC ROUTE (For QR Code Customers)
// ==========================================
router.get("/public/:ownerId", async (req, res) => {
  try {
    // Fetch menu where the 'owner' matches the ID in the URL
    const menu = await Menu.find({ owner: req.params.ownerId });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 🔒 PROTECTED ROUTES (For Owner Dashboard)
// ==========================================

// ADD menu item
router.post("/", authMiddleware, async (req, res) => {
  try {
    // ...req.body will now include 'stock' and 'category' automatically
    const menuItem = new Menu({
      ...req.body,
      owner: req.owner._id,
    });

    const savedItem = await menuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all menu items (For Owner)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Menu.find({ owner: req.owner._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE menu item (Now includes STOCK)
router.put("/:id", authMiddleware, async (req, res) => {
  console.log(`🔄 Update Request for ID: ${req.params.id}`);

  try {
    // ✅ Extract 'stock' and 'category' along with name/price
    const { name, price, category, stock } = req.body;

    const updatedItem = await Menu.findOneAndUpdate(
      { _id: req.params.id, owner: req.owner._id },
      { name, price, category, stock }, // ✅ Update Stock & Category
      { new: true },
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Item not found or unauthorized" });
    }

    console.log("✅ Item Updated Successfully");
    res.json(updatedItem);
  } catch (error) {
    console.error("❌ Update Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE menu item
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Menu.findOneAndDelete({
      _id: req.params.id,
      owner: req.owner._id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Menu item not found or not authorized",
      });
    }

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
