
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getMembers,
  getOverviewStats,
  getOrders,
  getBookings,
  updateBookingStatus,
} = require("../controllers/adminController");

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to FITZONE Admin API",
    admin: req.user,
  });
});

router.get("/members", getMembers);

router.get("/dashboard", getOverviewStats);

router.get("/orders", getOrders);

// Bookings
router.get("/bookings", getBookings);

router.patch("/bookings/:id/status", updateBookingStatus);

module.exports = router;
