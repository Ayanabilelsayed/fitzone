
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

// These IDs and names must match the frontend.
const trainers = {
  ahmed: "Ahmed",
  sara: "Sara",
  omar: "Omar",
  nour: "Nour",
};

const allowedWorkouts = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "CrossFit",
  "Full Body Workout",
];

const createBooking = async (req, res) => {
  let client;

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

    // The user ID comes from the verified JWT, not the request body.
    const userId = req.user.id;

    // Validate the selected plan.
    const selectedPlan = plans[planId];

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Please select a valid membership plan.",
      });
    }

    // Validate trainer.
    const trainerName = trainers[trainerId];

    if (!trainerName) {
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

    // Validate date format.
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

    // Validate time.
    if (
      typeof time !== "string" ||
      !time.trim() ||
      time.length > 20
    ) {
      return res.status(400).json({
        message: "Please select a valid booking time.",
      });
    }

    // Validate payment choice.
    if (!["cash", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Please select a valid payment method.",
      });
    }

    // Online payments are not processed until a payment gateway is integrated.
    if (paymentMethod === "online") {
      return res.status(400).json({
        message:
          "Online payment is not available yet. Please select cash at the gym.",
      });
    }

    if (termsAccepted !== true) {
      return res.status(400).json({
        message: "You must accept the terms and conditions.",
      });
    }

    client = await pool.connect();

    await client.query("BEGIN");

    // Prevent two bookings for the same trainer, date and time.
    const existingBooking = await client.query(
      `SELECT id
       FROM bookings
       WHERE trainer_id = $1
         AND booking_date = $2
         AND booking_time = $3
         AND status <> 'cancelled'
       LIMIT 1
       FOR UPDATE`,
      [trainerId, date, time.trim()]
    );

    if (existingBooking.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        message:
          "This trainer is already booked at that time. Please choose another time.",
      });
    }

    // Create a pending subscription.
    const subscriptionResult = await client.query(
      `INSERT INTO subscriptions
        (user_id, plan_id, plan_name, price, duration_months,
         payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, plan_id, plan_name, price, payment_method, status, created_at`,
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

    // Create the booking linked to the subscription and user.
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
        trainerId,
        trainerName,
        workout,
        date,
        time.trim(),
        true,
        "pending",
      ]
    );

    const booking = bookingResult.rows[0];

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Booking request created successfully.",
      subscription,
      booking,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Create booking error:", error.message);

    if (error.code === "23503") {
      return res.status(401).json({
        message: "User account was not found. Please log in again.",
      });
    }

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
