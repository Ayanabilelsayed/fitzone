
const pool = require("../DB/db");

// Get all registered members
const getMembers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, full_name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      members: result.rows,
    });
  } catch (error) {
    console.error("Get members error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load members.",
    });
  }
};

// Get dashboard statistics
const getOverviewStats = async (req, res) => {
  try {
    const [
      membersResult,
      classesResult,
      trainersResult,
      bookingsResult,
      growth12Result,
      growth30Result,
      growth7Result,
      bookingsByWorkoutResult,
      classDistributionResult,
      ordersResult,
      paymentsResult,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS total FROM users"),
      pool.query("SELECT COUNT(*)::int AS total FROM classes"),
      pool.query("SELECT COUNT(*)::int AS total FROM trainers"),
      pool.query("SELECT COUNT(*)::int AS total FROM bookings"),

      pool.query(`
        SELECT
          TO_CHAR(months.month, 'Mon') AS label,
          (
            SELECT COUNT(*)::int
            FROM users
            WHERE created_at < months.month + INTERVAL '1 month'
          ) AS members
        FROM generate_series(
          DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months',
          DATE_TRUNC('month', CURRENT_DATE),
          INTERVAL '1 month'
        ) AS months(month)
        ORDER BY months.month
      `),

      pool.query(`
        SELECT
          TO_CHAR(days.day, 'DD Mon') AS label,
          (
            SELECT COUNT(*)::int
            FROM users
            WHERE created_at < days.day + INTERVAL '1 day'
          ) AS members
        FROM generate_series(
          CURRENT_DATE - INTERVAL '29 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        ) AS days(day)
        ORDER BY days.day
      `),

      pool.query(`
        SELECT
          TO_CHAR(days.day, 'Dy') AS label,
          (
            SELECT COUNT(*)::int
            FROM users
            WHERE created_at < days.day + INTERVAL '1 day'
          ) AS members
        FROM generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        ) AS days(day)
        ORDER BY days.day
      `),

      pool.query(`
        SELECT
          COALESCE(NULLIF(TRIM(workout), ''), 'Other') AS name,
          COUNT(*)::int AS bookings
        FROM bookings
        GROUP BY COALESCE(NULLIF(TRIM(workout), ''), 'Other')
        ORDER BY bookings DESC
        LIMIT 8
      `),

      pool.query(`
        SELECT
          COALESCE(NULLIF(TRIM(category), ''), 'Other') AS name,
          COUNT(*)::int AS value
        FROM classes
        GROUP BY COALESCE(NULLIF(TRIM(category), ''), 'Other')
        ORDER BY value DESC
      `),

      pool.query(`
        SELECT
          COUNT(*)::int AS total_orders,
          COUNT(*) FILTER (WHERE status = 'paid')::int AS paid_orders,
          COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
          COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_orders
        FROM orders
      `),

      pool.query(`
        SELECT
          COALESCE(
            SUM(amount) FILTER (WHERE status = 'paid'), 0
          )::numeric AS total_revenue,
          COALESCE(
            SUM(amount) FILTER (
              WHERE status = 'paid' AND currency = 'usd'
            ), 0
          )::numeric AS usd_revenue
        FROM orders
      `),
    ]);

    const orderStats = ordersResult.rows[0];
    const paymentStats = paymentsResult.rows[0];

    return res.status(200).json({
      success: true,
      stats: {
        totalMembers: membersResult.rows[0].total,
        totalClasses: classesResult.rows[0].total,
        totalTrainers: trainersResult.rows[0].total,
        totalBookings: bookingsResult.rows[0].total,

        totalOrders: orderStats.total_orders,
        paidOrders: orderStats.paid_orders,
        pendingOrders: orderStats.pending_orders,
        cancelledOrders: orderStats.cancelled_orders,

        totalRevenue: Number(paymentStats.total_revenue),
        usdRevenue: Number(paymentStats.usd_revenue),

        memberGrowth: {
          "7 days": growth7Result.rows,
          "30 days": growth30Result.rows,
          "12 months": growth12Result.rows,
        },

        bookingsByWorkout: bookingsByWorkoutResult.rows,
        classDistribution: classDistributionResult.rows,
      },
    });
  } catch (error) {
    console.error("Overview stats error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load overview statistics.",
    });
  }
};

// Get orders and payment statuses
const getOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.user_id,
        u.full_name,
        u.email,
        o.order_type,
        o.amount,
        o.currency,
        o.status,
        o.stripe_session_id,
        o.created_at,
        COALESCE(
          STRING_AGG(oi.item_name, ', ' ORDER BY oi.id),
          'Order'
        ) AS items
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id, u.full_name, u.email
      ORDER BY o.created_at DESC
      LIMIT 100
    `);

    return res.status(200).json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load orders.",
    });
  }
};

// Get all bookings with member, trainer, and subscription details
const getBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.user_id,
        u.full_name,
        u.email,

        b.subscription_id,
        s.plan_id,
        s.plan_name,
        s.price,
        s.payment_method,
        s.status AS subscription_status,

        b.trainer_id,
        b.trainer_name,

        b.workout,
        b.booking_date,
        b.booking_time,
        b.terms_accepted,
        b.status,
        b.created_at

      FROM bookings b
      JOIN users u ON u.id = b.user_id
      JOIN subscriptions s ON s.id = b.subscription_id

      ORDER BY b.created_at DESC
      LIMIT 200
    `);

    return res.status(200).json({
      success: true,
      total: result.rows.length,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("Get bookings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load bookings.",
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ];

    if (
      !Number.isSafeInteger(bookingId) ||
      bookingId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const result = await pool.query(
      `
        UPDATE bookings
        SET status = $1
        WHERE id = $2
        RETURNING id, status
      `,
      [status, bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Update booking status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
    });
  }
};

module.exports = {
  getMembers,
  getOverviewStats,
  getOrders,
  getBookings,
  updateBookingStatus,
};
