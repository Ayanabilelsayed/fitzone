const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getMembers,
  getOverviewStats,
} = require("../controllers/adminController");

router.get("/", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to FITZONE Admin API",
    admin: req.user,
  });
});

router.get(
  "/members",
  authMiddleware,
  adminMiddleware,
  getMembers
);

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getOverviewStats
);

module.exports = router;