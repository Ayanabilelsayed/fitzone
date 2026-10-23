
const pool = require("../DB/db");

const getClasses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, level,
              duration_minutes, image_url
       FROM classes
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    return res.status(200).json({
      success: true,
      classes: result.rows,
    });
  } catch (error) {
    console.error("Get classes error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
    });
  }
};

module.exports = { getClasses };
