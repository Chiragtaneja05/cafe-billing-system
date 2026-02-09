const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cafeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // ✅ NEW FIELDS FOR SETTINGS
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Owner", ownerSchema);
