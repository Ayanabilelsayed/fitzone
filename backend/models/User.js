
const pool = require("../config/db");

const User = {
  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return result.rows[0];
  },

  async create({ fullName, email, passwordHash, termsAccepted }) {
    const result = await pool.query(
      `INSERT INTO users (
        full_name,
        email,
        password_hash,
        terms_accepted,
        terms_accepted_at
      )
      VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN NOW() ELSE NULL END)
      RETURNING id, full_name, email, created_at`,
      [fullName, email, passwordHash, termsAccepted]
    );

    return result.rows[0];
  },
};

module.exports = User;
