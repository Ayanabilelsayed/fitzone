const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate form data
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    // Get receiver email and remove extra spaces
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL?.trim();

    if (!receiverEmail) {
      return res.status(500).json({
        success: false,
        message: "Receiver email is not configured.",
      });
    }

    // Send the contact message
    const { data, error } = await resend.emails.send({
      from: "FITZONE Contact <onboarding@resend.dev>",
      to: [receiverEmail],
      replyTo: email.trim(),
      subject: `New FITZONE message from ${name.trim()}`,
      text: `Name: ${name.trim()}
Email: ${email.trim()}

Message:
${message.trim()}`,
    });

    if (error) {
      console.error("Resend error:", error);

      return res.status(502).json({
        success: false,
        message: "Could not send the message. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { sendContactMessage };