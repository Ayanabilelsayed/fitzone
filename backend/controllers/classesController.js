const pool = require("../DB/db");

// Get active classes for the public Classes page
const getClasses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, category, level, duration_minutes, image_url
      FROM classes
      WHERE is_active = TRUE
      ORDER BY id ASC
    `);

    return res.status(200).json({
      success: true,
      classes: result.rows,
    });
  } catch (error) {
    console.error("Get classes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
    });
  }
};

// Get all classes for the admin page, including inactive ones
const getAllClassesForAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, category, level,
             duration_minutes, image_url, is_active
      FROM classes
      ORDER BY id ASC
    `);

    return res.status(200).json({
      success: true,
      classes: result.rows,
    });
  } catch (error) {
    console.error("Get admin classes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin classes",
    });
  }
};

// Add a class
const addClass = async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      duration_minutes,
      image_url,
    } = req.body;

    if (!name?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Class name and category are required",
      });
    }

    const duration = Number(duration_minutes ?? 60);

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number",
      });
    }

    const result = await pool.query(
      `INSERT INTO classes
        (name, category, level, duration_minutes, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING id, name, category, level,
                 duration_minutes, image_url, is_active`,
      [
        name.trim(),
        category.trim(),
        level?.trim() || null,
        duration,
        image_url?.trim() || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Class added successfully",
      class: result.rows[0],
    });
  } catch (error) {
    console.error("Add class error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add class",
      error: error.message,
    });
  }
};

// Soft-delete a class so it no longer appears on the public page
const deleteClass = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    const result = await pool.query(
      `UPDATE classes
       SET is_active = FALSE
       WHERE id = $1 AND is_active = TRUE
       RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found or already inactive",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Delete class error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message,
    });
  }
};
// Update a class
const updateClass = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    const {
      name,
      category,
      level,
      duration_minutes,
      image_url,
    } = req.body;

    if (!name?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Class name and category are required",
      });
    }

    const duration = Number(duration_minutes);

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number",
      });
    }

    const result = await pool.query(
      `UPDATE classes
       SET name = $1,
           category = $2,
           level = $3,
           duration_minutes = $4,
           image_url = $5
       WHERE id = $6 AND is_active = TRUE
       RETURNING id, name, category, level,
                 duration_minutes, image_url, is_active`,
      [
        name.trim(),
        category.trim(),
        level?.trim() || null,
        duration,
        image_url?.trim() || null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Active class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: result.rows[0],
    });
  } catch (error) {
    console.error("Update class error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message,
    });
  }
};

module.exports = {
  getClasses,
  getAllClassesForAdmin,
  addClass,
  updateClass,
  deleteClass,
};