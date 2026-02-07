const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },

    // 🔑 IMPORTANT: link menu item to owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner", // or "User" — MUST match your auth model
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Menu", menuSchema);
