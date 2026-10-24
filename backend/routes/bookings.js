
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createBooking } = require("../controllers/bookingController");

// A logged-in user can create a booking.
router.post("/", authMiddleware, createBooking);

module.exports = router;
