
const express = require("express");
const router = express.Router();
const pool = require("../DB/db");
const stripe = require("../config/stripe");
const authMiddleware = require("../middleware/authMiddleware");

const plans = {
  basic: { name: "Basic", price: 25 },
  pro: { name: "Pro", price: 45 },
  elite: { name: "Elite", price: 70 },
};

router.post("/checkout", authMiddleware, async (req, res) => {
  let client;
  let transactionStarted = false;

  try {
    const { planId } = req.body;
    const userId = req.user.id;
    const plan = plans[planId];

    if (!plan) {
      return res.status(400).json({
        message: "Please select a valid membership plan.",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is missing from backend/.env");
    }

    client = await pool.connect();

    const userResult = await client.query(
      "SELECT id, email, full_name FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const user = userResult.rows[0];

    await client.query("BEGIN");
    transactionStarted = true;

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_type, amount, currency, status)
       VALUES ($1, 'membership', $2, 'usd', 'pending')
       RETURNING id`,
      [userId, plan.price]
    );

    const orderId = orderResult.rows[0].id;

    await client.query(
      `INSERT INTO order_items
        (order_id, item_name, quantity, unit_price)
       VALUES ($1, $2, 1, $3)`,
      [orderId, `${plan.name} Membership`, plan.price]
    );

    await client.query("COMMIT");
    transactionStarted = false;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      client_reference_id: String(orderId),
      metadata: {
        orderId: String(orderId),
        userId: String(userId),
        planId,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} Membership`,
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],

      // Return to the Home page after successful payment.
      success_url: `${frontendUrl}/`,

      // Return to the Home page if checkout is cancelled.
      cancel_url: `${frontendUrl}/`,
    });

    await pool.query(
      `UPDATE orders
       SET stripe_session_id = $1
       WHERE id = $2`,
      [session.id, orderId]
    );

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    if (client && transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Transaction rollback failed:", rollbackError.message);
      }
    }

    console.error("Checkout error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to start checkout. Please try again.",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
