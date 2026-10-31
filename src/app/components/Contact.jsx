
"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Backend API URL
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSent(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send your message.");
      }

      setSent(true);
      form.reset();
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again later."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full bg-[var(--background)] px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold text-[var(--text)] sm:text-4xl">
            Get In Touch
          </h1>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--text-secondary)]">
            Have questions about memberships, private coaching, or group
            schedules? Send us a message and our team will respond within 24
            hours.
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-8 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8 lg:p-10">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                Let&apos;s Talk
              </h2>

              <p className="mt-3 leading-7 text-[var(--text-secondary)]">
                We would love to hear from you. Reach out to learn more about
                our membership plans, training sessions, and fitness services.
              </p>
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-xl text-[var(--primary)]">
                  📍
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Location
                  </p>

                  <p className="mt-1 break-words font-semibold leading-6 text-[var(--text)]">
                    123 Fitness Ave, Suite 400, New York, NY
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-xl text-[var(--primary)]">
                  📞
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold text-[var(--text)]">
                    +1 (555) 019-2834
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-xl text-[var(--primary)]">
                  ✉️
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold text-[var(--text)]">
                    support@fitzone.com
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-light)] p-5">
              <p className="font-bold text-[var(--text)]">
                Your fitness journey starts here.
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Contact our team and let us help you find the right training
                plan for your goals.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm sm:p-8 lg:p-10">
            {sent ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-soft)] text-2xl font-bold text-[var(--primary)]">
                  ✓
                </div>

                <h2 className="text-2xl font-bold text-[var(--text)]">
                  Message Sent!
                </h2>

                <p className="max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                  Thank you for reaching out. We appreciate your message and
                  will get back to you shortly.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setError("");
                  }}
                  className="pt-2 text-sm font-bold text-[var(--primary)] transition-opacity hover:opacity-80"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[var(--text)]">
                    Send Us a Message
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Fill out the form below and tell us how we can help.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--text)]"
                    >
                      Full Name
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      required
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--text)]"
                    >
                      Email Address
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      required
                      type="email"
                      autoComplete="email"
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--text)]"
                    >
                      Message
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3.5 text-sm leading-6 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg bg-red-500/10 p-3 text-sm leading-6 text-red-500"
                    >
                      {error}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--button-bg)] py-4 text-sm font-bold text-[var(--button-text)] shadow-md transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                  >
                    {loading ? "Sending..." : "Send Message →"}
                  </button>

                  <p className="text-center text-xs leading-5 text-[var(--text-muted)]">
                    We aim to respond to all inquiries within 24 hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
