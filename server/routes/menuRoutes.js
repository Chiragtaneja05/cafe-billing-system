const express = require("express");
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

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

// 🔒 GET all menu items (OWNER ONLY)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Menu.find({ owner: req.owner._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 DELETE menu item (OWNER SAFE)
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
