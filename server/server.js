require("dotenv").config();
console.log("ENV CHECK:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes
const menuRoutes = require("./routes/menuRoutes");
const billRoutes = require("./routes/billRoutes");
const authRoutes = require("./routes/authRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express(); // ✅ app FIRST

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://classy-cendol-c9eed7.netlify.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// routes
app.use("/api/menu", menuRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sales", salesRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Cafe Billing API running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
