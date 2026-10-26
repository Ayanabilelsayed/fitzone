const bcrypt = require("bcryptjs");
const pool = require("../DB/db");
const jwt = require("jsonwebtoken");



// Login
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
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

module.exports = {
  loginUser,
};