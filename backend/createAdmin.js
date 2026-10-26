
require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./DB/db");

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "Please configure ADMIN_EMAIL and ADMIN_PASSWORD in .env"
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const existingAdmin = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      await pool.query(
        `UPDATE users
         SET password_hash = $1, role = 'admin'
         WHERE email = $2`,
        [passwordHash, email]
      );

      console.log("Existing account updated to admin successfully.");
    } else {
      await pool.query(
        `INSERT INTO users
          (full_name, email, password_hash, terms_accepted,
           terms_accepted_at, role)
         VALUES ($1, $2, $3, TRUE, NOW(), 'admin')`,
        ["FITZONE Admin", email, passwordHash]
      );

      console.log("Admin account created successfully.");
    }
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

createAdmin();
