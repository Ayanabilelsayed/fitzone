
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get Current User Profile
router.get("/me", authMiddleware, getCurrentUser);

// Update Current User Profile
router.put("/me", authMiddleware, updateCurrentUser);

module.exports = router;
