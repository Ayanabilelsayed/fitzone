"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-[var(--text)]">Get In Touch</h1>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Have questions about memberships, private coaching, or group schedules? Send us a message and our team will respond within 24 hours.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary)] flex items-center justify-center font-bold">📍</div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-semibold uppercase">Location</p>
                <p className="font-semibold text-[var(--text)]">123 Fitness Ave, Suite 400, New York, NY</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary)] flex items-center justify-center font-bold">📞</div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-semibold uppercase">Phone</p>
                <p className="font-semibold text-[var(--text)]">+1 (555) 019-2834</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary)] flex items-center justify-center font-bold">✉️</div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-semibold uppercase">Email</p>
                <p className="font-semibold text-[var(--text)]">support@fitzone.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary)] flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
              <h3 className="text-2xl font-bold text-[var(--text)]">Message Sent!</h3>
              <p className="text-sm text-[var(--text-muted)]">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] uppercase mb-2">Full Name</label>
                <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text)] uppercase mb-2">Email Address</label>
                <input required type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text)] uppercase mb-2">Message</label>
                <textarea required rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-sm resize-none" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] transition-colors shadow-md">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}