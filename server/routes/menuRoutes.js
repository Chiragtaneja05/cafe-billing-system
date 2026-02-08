const express = require("express");
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Debug Log: Confirm this file is loaded
console.log("✅ Menu Routes Loaded");

// 🔒 ADD menu item
router.post("/", authMiddleware, async (req, res) => {
  try {
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

// 🔒 GET all menu items
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Menu.find({ owner: req.owner._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 UPDATE menu item (The Route Causing Issues)
router.put("/:id", authMiddleware, async (req, res) => {
  console.log(`🔄 Update Request Received for ID: ${req.params.id}`); // Server Log

  try {
    const { name, price, category } = req.body;

    const updatedItem = await Menu.findOneAndUpdate(
      { _id: req.params.id, owner: req.owner._id },
      { name, price, category },
      { new: true },
    );

    if (!updatedItem) {
      console.log("❌ Item not found or unauthorized");
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

// 🔒 DELETE menu item
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
