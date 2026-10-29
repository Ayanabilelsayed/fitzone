
const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const pool = require("../DB/db");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({
        message: "Stripe webhook secret is not configured.",
      });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Stripe signature verification failed:", error.message);
      return res.status(400).send("Invalid Stripe signature.");
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        if (session.payment_status !== "paid") {
          return res.status(200).json({ received: true });
        }

        const orderId = session.metadata?.orderId;

        if (!orderId || !/^\d+$/.test(orderId)) {
          return res.status(400).json({
            message: "Invalid order reference.",
          });
        }

        const result = await pool.query(
          `UPDATE orders
           SET status = 'paid'
           WHERE id = $1
             AND stripe_session_id = $2
             AND status = 'pending'
           RETURNING id`,
          [orderId, session.id]
        );

        if (result.rowCount === 0) {
          const existing = await pool.query(
            `SELECT id, status
             FROM orders
             WHERE id = $1 AND stripe_session_id = $2`,
            [orderId, session.id]
          );

          if (existing.rows.length === 0) {
            return res.status(400).json({
              message: "Order does not match this Stripe session.",
            });
          }
        }
      }

      if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId && /^\d+$/.test(orderId)) {
          await pool.query(
            `UPDATE orders
             SET status = 'cancelled'
             WHERE id = $1
               AND stripe_session_id = $2
               AND status = 'pending'`,
            [orderId, session.id]
          );
        }
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Stripe webhook processing error:", error.message);
      return res.status(500).json({
        message: "Webhook processing failed.",
      });
    }
  }
);

module.exports = router;
