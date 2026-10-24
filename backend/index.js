
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./DB/db");

const authRoutes = require("./routes/auth");
const classesRoutes = require("./routes/classes");
const trainersRoutes = require("./routes/trainers");
const contactRoutes = require("./routes/contact");
const bookingsRoutes = require("./routes/bookings");

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

// Test the backend
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/trainers", trainersRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingsRoutes);

// Local server only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`FITZONE Backend running on port ${PORT}`);
  });
}

// Export Express app for Vercel
module.exports = app;
