
const bcrypt = require("bcryptjs");
const pool = require("../DB/db");
const crypto = require("crypto");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);



// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Please enter your email address",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    // Do not reveal whether an account exists.
    const message =
      "If an account exists with this email, you will receive a password reset link.";

    if (result.rows.length === 0) {
      return res.status(200).json({ message });
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error("RESEND_FROM_EMAIL is not configured");

      return res.status(500).json({
        message: "Email service is not configured",
      });
    }

    const userId = result.rows[0].id;

    // Generate a secure, random token.
    const token = crypto.randomBytes(32).toString("hex");

    // Store only the token hash in the database.
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Invalidate previously unused reset tokens.
    await pool.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL`,
      [userId]
    );

    // The token expires after 15 minutes.
    await pool.query(
      `INSERT INTO password_reset_tokens
        (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '15 minutes')`,
      [userId, tokenHash]
    );

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [normalizedEmail],
      subject: "Reset your FITZONE password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Reset your FITZONE password</h2>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to choose a new password.
          </p>

          <p>
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                background: #C8FF3D;
                color: #0b0f0d;
                padding: 12px 18px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </p>

          <p>This link expires in 15 minutes.</p>

          <p>
            If you did not request this, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error.message);

      // Invalidate the token if sending failed.
      await pool.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE token_hash = $1 AND used_at IS NULL`,
        [tokenHash]
      );

      return res.status(502).json({
        message: "Unable to send the reset email. Please try again later.",
      });
    }

    console.log("Password reset email accepted:", data?.id);

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Server error while requesting password reset",
    });
  }
};



// Reset Password
const resetPassword = async (req, res) => {
  let client;

  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
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
          "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    client = await pool.connect();

    await client.query("BEGIN");

    const result = await client.query(
      `SELECT id, user_id
       FROM password_reset_tokens
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       LIMIT 1
       FOR UPDATE`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "This reset link is invalid or has expired.",
      });
    }

    const resetToken = result.rows[0];
    const passwordHash = await bcrypt.hash(password, 12);

    await client.query(
      `UPDATE users
       SET password_hash = $1, updated_at = NOW()
       WHERE id = $2`,
      [passwordHash, resetToken.user_id]
    );

    await client.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL`,
      [resetToken.user_id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Server error while resetting password.",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};