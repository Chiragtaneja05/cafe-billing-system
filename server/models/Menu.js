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
    // ✅ NEW: Stock field for Inventory Tracking
    stock: {
      type: Number,
      default: 100, // Default stock if not specified
    },

    // 🔑 Link menu item to owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Menu", menuSchema);
