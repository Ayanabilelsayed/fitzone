
const pool = require("../DB/db");

// Get all active trainers (Public)
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

// Get one active trainer (Public)
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

// Get all trainers, including inactive ones (Admin)
async function getAllTrainersForAdmin(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, role, experience, image_url, bio, is_active
       FROM trainers
       ORDER BY id ASC`
    );

    res.status(200).json({
      success: true,
      trainers: result.rows,
    });
  } catch (error) {
    console.error("Get admin trainers error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not retrieve trainers",
    });
  }
}

// Add trainer (Admin)
async function addTrainer(req, res) {
  try {
    const { name, role, experience, image_url, bio } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof role !== "string" || !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Trainer name and role are required",
      });
    }

    const parsedExperience = Number(experience);

    if (
      experience === undefined ||
      experience === null ||
      experience === "" ||
      !Number.isInteger(parsedExperience) ||
      parsedExperience < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a non-negative whole number",
      });
    }

    const result = await pool.query(
      `INSERT INTO trainers
        (name, role, experience, image_url, bio, is_active)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING id, name, role, experience, image_url, bio, is_active`,
      [
        name.trim(),
        role.trim(),
        parsedExperience,
        image_url?.trim() || null,
        bio?.trim() || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Trainer added successfully",
      trainer: result.rows[0],
    });
  } catch (error) {
    console.error("Add trainer error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not add trainer",
    });
  }
}

// Update trainer (Admin)
async function updateTrainer(req, res) {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const { name, role, experience, image_url, bio } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof role !== "string" || !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Trainer name and role are required",
      });
    }

    const parsedExperience = Number(experience);

    if (
      experience === undefined ||
      experience === null ||
      experience === "" ||
      !Number.isInteger(parsedExperience) ||
      parsedExperience < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a non-negative whole number",
      });
    }

    const result = await pool.query(
      `UPDATE trainers
       SET name = $1,
           role = $2,
           experience = $3,
           image_url = $4,
           bio = $5
       WHERE id = $6
       RETURNING id, name, role, experience, image_url, bio, is_active`,
      [
        name.trim(),
        role.trim(),
        parsedExperience,
        image_url?.trim() || null,
        bio?.trim() || null,
        Number(id),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer: result.rows[0],
    });
  } catch (error) {
    console.error("Update trainer error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not update trainer",
    });
  }
}

// Toggle trainer active status (Admin)
async function deleteTrainer(req, res) {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const result = await pool.query(
      `UPDATE trainers
       SET is_active = NOT is_active
       WHERE id = $1
       RETURNING id, name, role, experience, image_url, bio, is_active`,
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
      message: result.rows[0].is_active
        ? "Trainer restored successfully"
        : "Trainer deactivated successfully",
      trainer: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle trainer status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not change trainer status",
    });
  }
}

module.exports = {
  getTrainers,
  getTrainerById,
  getAllTrainersForAdmin,
  addTrainer,
  updateTrainer,
  deleteTrainer,
};
