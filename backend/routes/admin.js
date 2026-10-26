
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Protected admin route
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to FITZONE Admin API",
      admin: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;
