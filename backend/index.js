
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./DB/db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json());

// Test the backend
app.get("/", (req, res) => {
  res.json({
    message: "FITZONE Backend is running!",
  });
});

// Test the database connection
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.status(200).json({
      success: true,
      message: "Database connected successfully!",
      time: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Authentication routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FITZONE Backend running on port ${PORT}`);
});
