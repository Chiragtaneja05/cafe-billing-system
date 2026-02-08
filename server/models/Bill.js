const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      default: "Guest", // Default if left empty
    },
    customerPhone: {
      type: String,
      default: "", // Optional
    },
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
      ref: "Owner",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bill", billSchema);
