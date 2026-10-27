const pool = require("../DB/db");

// Get all members
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
      message: "Failed to load members",
    });
  }
};

// Get dashboard overview statistics and charts
const getOverviewStats = async (req, res) => {
  try {
    // Total counts
    const membersResult = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM users
    `);

    const classesResult = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM classes
    `);

    const trainersResult = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM trainers
    `);

    const bookingsResult = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM bookings
    `);

    // Cumulative member growth over the last 12 months
    const growth12Result = await pool.query(`
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
    `);

    // Cumulative member growth over the last 30 days
    const growth30Result = await pool.query(`
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
    `);

    // Cumulative member growth over the last 7 days
    const growth7Result = await pool.query(`
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
    `);

    // Bookings grouped by workout
    const bookingsByWorkoutResult = await pool.query(`
      SELECT
        COALESCE(NULLIF(TRIM(workout), ''), 'Other') AS name,
        COUNT(*)::int AS bookings
      FROM bookings
      GROUP BY COALESCE(NULLIF(TRIM(workout), ''), 'Other')
      ORDER BY bookings DESC
    `);

    // Classes grouped by category
    const classDistributionResult = await pool.query(`
      SELECT
        COALESCE(NULLIF(TRIM(category), ''), 'Other') AS name,
        COUNT(*)::int AS value
      FROM classes
      GROUP BY COALESCE(NULLIF(TRIM(category), ''), 'Other')
      ORDER BY value DESC
    `);

    return res.status(200).json({
      success: true,
      stats: {
        totalMembers: membersResult.rows[0].total,
        totalClasses: classesResult.rows[0].total,
        totalTrainers: trainersResult.rows[0].total,
        totalBookings: bookingsResult.rows[0].total,

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
    console.error("Overview stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load overview statistics",
    });
  }
};

module.exports = {
  getMembers,
  getOverviewStats,
};