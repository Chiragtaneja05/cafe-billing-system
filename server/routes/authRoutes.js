const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

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
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
