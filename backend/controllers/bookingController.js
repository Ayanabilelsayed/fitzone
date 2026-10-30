
const pool = require("../DB/db");

// Plans are defined on the backend so the client cannot change their prices.
const plans = {
  basic: {
    name: "Basic",
    price: 25,
  },
  pro: {
    name: "Pro",
    price: 45,
  },
  elite: {
    name: "Elite",
    price: 70,
  },
};

const allowedWorkouts = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "CrossFit",
  "Full Body Workout",
];

// Allowed booking times (must match the frontend).
const allowedTimes = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

const createBooking = async (req, res) => {
  let client;
  let transactionStarted = false;

  try {
    const {
      planId,
      trainerId,
      workout,
      date,
      time,
      paymentMethod,
      termsAccepted,
    } = req.body;

    // Get user ID from the verified JWT.
    const userId = req.user.id;

    // Validate membership plan.
    const selectedPlan = plans[planId];

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Please select a valid membership plan.",
      });
    }

    // Validate trainer ID.
    const parsedTrainerId = Number(trainerId);

    if (
      trainerId === undefined ||
      trainerId === null ||
      trainerId === "" ||
      !Number.isInteger(parsedTrainerId) ||
      parsedTrainerId <= 0
    ) {
      return res.status(400).json({
        message: "Please select a valid trainer.",
      });
    }

    // Validate workout.
    if (!allowedWorkouts.includes(workout)) {
      return res.status(400).json({
        message: "Please select a valid workout.",
      });
    }

    // Validate date format and actual calendar date.
    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return res.status(400).json({
        message: "Please select a valid booking date.",
      });
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({
        message: "Please select a valid booking date.",
      });
    }

    // Validate booking time.
    if (
      typeof time !== "string" ||
      !allowedTimes.includes(time.trim())
    ) {
      return res.status(400).json({
        message: "Please select a valid booking time.",
      });
    }

    // Cash bookings only. Stripe checkout uses a separate endpoint.
    if (paymentMethod !== "cash") {
      return res.status(400).json({
        message: "Please select cash payment.",
      });
    }

    // Validate terms acceptance.
    if (termsAccepted !== true) {
      return res.status(400).json({
        message: "You must accept the terms and conditions.",
      });
    }

    // Connect to database.
    client = await pool.connect();

    // Get the real active trainer from database.
    const trainerResult = await client.query(
      `SELECT id, name
       FROM trainers
       WHERE id = $1 AND is_active = TRUE`,
      [parsedTrainerId]
    );

    if (trainerResult.rows.length === 0) {
      return res.status(400).json({
        message: "Please select a valid trainer.",
      });
    }

    const trainer = trainerResult.rows[0];

    // Start transaction.
    await client.query("BEGIN");
    transactionStarted = true;

    // Create pending subscription.
    const subscriptionResult = await client.query(
      `INSERT INTO subscriptions
        (user_id, plan_id, plan_name, price, duration_months,
         payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, plan_id, plan_name, price,
                 payment_method, status, created_at`,
      [
        userId,
        planId,
        selectedPlan.name,
        selectedPlan.price,
        1,
        paymentMethod,
        "pending",
      ]
    );

    const subscription = subscriptionResult.rows[0];

    // Create booking.
    // The database unique index prevents duplicate active bookings.
    const bookingResult = await client.query(
      `INSERT INTO bookings
        (subscription_id, user_id, trainer_id, trainer_name,
         workout, booking_date, booking_time, terms_accepted, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, subscription_id, trainer_id, trainer_name,
                 workout, booking_date, booking_time, status, created_at`,
      [
        subscription.id,
        userId,
        trainer.id,
        trainer.name,
        workout,
        date,
        time.trim(),
        true,
        "pending",
      ]
    );

    const booking = bookingResult.rows[0];

    // Save both records together.
    await client.query("COMMIT");
    transactionStarted = false;

    return res.status(201).json({
      message: "Booking request created successfully.",
      subscription,
      booking,
    });
  } catch (error) {
    // Roll back only if a transaction was started.
    if (client && transactionStarted) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Create booking error:", error.message);

    // Trainer already has a booking at this date and time.
    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "This trainer is already booked at that time. Please choose another time.",
      });
    }

    // Foreign key violation.
    if (error.code === "23503") {
      return res.status(400).json({
        message:
          "The selected user, trainer, or subscription was not found. Please check your account and booking details.",
      });
    }

    // Check constraint violation.
    if (error.code === "23514") {
      return res.status(400).json({
        message: "Some booking details are invalid.",
      });
    }

    return res.status(500).json({
      message: "Server error while creating the booking.",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = {
  createBooking,
};
