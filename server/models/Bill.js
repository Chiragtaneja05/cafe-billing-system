const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },

    // 🔑 IMPORTANT: Link bill to owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner", // or "User" (use the same name as your auth model)
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bill", billSchema);
