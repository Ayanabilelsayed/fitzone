
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--border)] text-[var(--text-secondary)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center font-bold text-lg text-[var(--button-text)]">
              FZ
            </div>

            <span className="font-extrabold text-xl text-[var(--text)] tracking-tight">
              FITZONE<span className="text-[var(--primary)]">.</span>
            </span>
          </div>

          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Elevate your lifestyle with state-of-the-art facilities, certified
            personal trainers, and tailored fitness programs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-[var(--text)] mb-4 text-base">
            Quick Links
          </h4>

          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/Classes"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Classes & Schedule
              </Link>
            </li>

            <li>
              <Link
                href="/Trainers"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Our Trainers
              </Link>
            </li>

            <li>
              <Link
                href="/Membership"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Membership Plans
              </Link>
            </li>

            <li>
              <Link
                href="/Contact"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* User Account */}
        <div>
          <h4 className="font-bold text-[var(--text)] mb-4 text-base">
            Account
          </h4>

          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/login"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                href="/Register"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Register
              </Link>
            </li>

            <li>
              <Link
                href="/Profile"
                className="hover:text-[var(--primary)] transition-colors"
              >
                My Profile
              </Link>
            </li>

            <li>
              <Link
                href="/terms"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Terms & Policies
              </Link>
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="font-bold text-[var(--text)] mb-4 text-base">
            Working Hours
          </h4>

          <p className="text-sm text-[var(--text-muted)] mb-2">
            Monday – Friday: 5:00 AM – 11:00 PM
          </p>

          <p className="text-sm text-[var(--text-muted)] mb-2">
            Saturday – Sunday: 6:00 AM – 10:00 PM
          </p>

          <div className="mt-4 pt-4 border-t border-[var(--border)] text-sm font-semibold text-[var(--primary)]">
            24/7 Access Available for Premium Members
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
        <p>© 2026 FITZONE. All rights reserved.</p>

        <div className="flex gap-6">
          <Link
            href="/terms"
            className="hover:text-[var(--primary)]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="hover:text-[var(--primary)]"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
