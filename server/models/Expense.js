const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    title: {
      type: String,
      required: true, // e.g., "Milk", "Electricity Bill"
    },
    amount: {
      type: Number,
      required: true, // e.g., 500
    },
    category: {
      type: String,
      default: "Inventory", // e.g., "Inventory", "Salary", "Utilities"
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
