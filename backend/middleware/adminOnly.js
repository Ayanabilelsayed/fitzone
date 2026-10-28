
const jwt = require("jsonwebtoken");
const pool = require("../DB/db");

const adminOnly = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id ?? decoded.userId ?? decoded.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const result = await pool.query(
      "SELECT id, role FROM users WHERE id = $1 LIMIT 1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (result.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Admin authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = adminOnly;
