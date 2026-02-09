const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import Middleware

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, cafeName, email, password } = req.body;

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = new Owner({
      name,
      cafeName,
      email,
      password: hashedPassword,
    });

    await owner.save();

    res.status(201).json({ message: "Owner registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        cafeName: owner.cafeName,
        email: owner.email,
        address: owner.address || "", // ✅ Send Address
        phone: owner.phone || "", // ✅ Send Phone
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ NEW: UPDATE PROFILE (Name, Address, Phone)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { cafeName, address, phone } = req.body;

    const owner = await Owner.findById(req.owner._id);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    // Update fields
    if (cafeName) owner.cafeName = cafeName;
    if (address) owner.address = address;
    if (phone) owner.phone = phone;

    await owner.save();

    res.json({
      message: "Profile updated",
      owner: {
        id: owner._id,
        name: owner.name,
        cafeName: owner.cafeName,
        email: owner.email,
        address: owner.address,
        phone: owner.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
