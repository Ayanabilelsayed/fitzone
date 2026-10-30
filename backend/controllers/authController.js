
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const pool = require("../DB/db");

const resend = new Resend(process.env.RESEND_API_KEY);

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      termsAccepted,
    } = req.body;

    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !password ||
      !confirmPassword
    ) {
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

    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number",
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

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Please enter your email and password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Authentication service is not configured",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login",
      details: error.message,
    });
  }
};

// Get Current User Profile
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        role,
        created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Server error while fetching profile",
    });
  }
};

// Update Current User Profile
const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    const updatedName = fullName?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (
      !updatedName &&
      !normalizedEmail &&
      !newPassword
    ) {
      return res.status(400).json({
        message: "Please provide at least one field to update",
      });
    }

    if (fullName !== undefined && !updatedName) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    if (email !== undefined) {
      if (!normalizedEmail) {
        return res.status(400).json({
          message: "Email cannot be empty",
        });
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(normalizedEmail)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      const existingEmail = await pool.query(
        `SELECT id FROM users
         WHERE email = $1 AND id != $2`,
        [normalizedEmail, userId]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(409).json({
          message: "This email is already used by another account",
        });
      }
    }

    let passwordHash = null;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Please enter your current password",
        });
      }

      if (!confirmNewPassword) {
        return res.status(400).json({
          message: "Please confirm your new password",
        });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          message: "New passwords do not match",
        });
      }

      if (
        newPassword.length < 8 ||
        !/[a-z]/.test(newPassword) ||
        !/[A-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, and a number",
        });
      }

      const userResult = await pool.query(
        "SELECT password_hash FROM users WHERE id = $1",
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        userResult.rows[0].password_hash
      );

      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          message: "Current password is incorrect",
        });
      }

      passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const result = await pool.query(
      `UPDATE users
       SET
         full_name = COALESCE($1, full_name),
         email = COALESCE($2, email),
         password_hash = COALESCE($3, password_hash)
       WHERE id = $4
       RETURNING id, full_name, email, role, created_at`,
      [
        updatedName || null,
        normalizedEmail || null,
        passwordHash,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "This email is already registered",
      });
    }

    return res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
};
