
const bcrypt = require("bcryptjs");
const pool = require("../DB/db");

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      termsAccepted,
    } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (termsAccepted !== true) {
      return res.status(400).json({
        message: "You must accept the terms and conditions",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users
        (full_name, email, password_hash, terms_accepted, terms_accepted_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, full_name, email, terms_accepted, created_at`,
      [fullName.trim(), normalizedEmail, passwordHash, true]
    );

    return res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

module.exports = { registerUser };
