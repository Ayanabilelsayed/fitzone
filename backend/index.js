
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./DB/db");

// Import routes
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const classesRoutes = require("./routes/classes");
const trainersRoutes = require("./routes/trainers");
const contactRoutes = require("./routes/contact");
const bookingsRoutes = require("./routes/bookings");

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
  })
);

app.use(express.json());

// Test backend
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FITZONE Backend is running!",
  });
});

// Test database connection
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

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/trainers", trainersRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminRoutes);

// Start local server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`FITZONE Backend running on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;
