
const pool = require("../DB/db");

// Get all active trainers
async function getTrainers(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, role, experience, image_url, bio
       FROM trainers
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    res.status(200).json({
      success: true,
      trainers: result.rows,
    });
  } catch (error) {
    console.error("Get trainers error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not retrieve trainers",
    });
  }
}

// Get one trainer by ID
async function getTrainerById(req, res) {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const result = await pool.query(
      `SELECT id, name, role, experience, image_url, bio
       FROM trainers
       WHERE id = $1 AND is_active = TRUE`,
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      trainer: result.rows[0],
    });
  } catch (error) {
    console.error("Get trainer error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not retrieve trainer",
    });
  }
}

module.exports = {
  getTrainers,
  getTrainerById,
};
