
"use client";

import Link from "next/link";

const sectionLinks = [
  { label: "Classes & Schedule", href: "/project#classes" },
  { label: "Our Trainers", href: "/project#trainers" },
  { label: "Membership Plans", href: "/project#membership" },
  { label: "Contact Us", href: "/project#contact" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/Register" },
  { label: "My Profile", href: "/Profile" },
];

export default function Footer() {
  const linkClass =
    "text-sm transition-colors duration-200 hover:text-[var(--primary)]";

  const headingClass =
    "mb-5 text-base font-bold text-[var(--text)]";

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--footer-bg)] pt-14 pb-8 text-[var(--text-secondary)] transition-colors duration-300 sm:pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link
            href="/project"
            aria-label="FITZONE Home"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-lg font-black text-[var(--button-text)]">
              FZ
            </div>

            <span className="text-xl font-extrabold tracking-tight text-[var(--text)]">
              FITZONE
              <span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-7 text-[var(--text-muted)]">
            Elevate your lifestyle with modern facilities, certified personal
            trainers, and fitness programs designed around your goals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className={headingClass}>Explore</h2>

          <ul className="space-y-3">
            {sectionLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h2 className={headingClass}>Your Account</h2>

          <ul className="space-y-3">
            {accountLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}

            <li>
              <Link href="/terms" className={linkClass}>
                Terms & Policies
              </Link>
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <div>
          <h2 className={headingClass}>Working Hours</h2>

          <div className="space-y-3 text-sm leading-6 text-[var(--text-muted)]">
            <p>
              <span className="font-semibold text-[var(--text)]">
                Monday – Friday
              </span>
              <br />
              5:00 AM – 11:00 PM
            </p>

            <p>
              <span className="font-semibold text-[var(--text)]">
                Saturday – Sunday
              </span>
              <br />
              6:00 AM – 10:00 PM
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[var(--border)] px-4 pt-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} FITZONE. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link href="/terms#privacy" className={linkClass}>
            Privacy Policy
          </Link>

          <Link href="/terms#terms" className={linkClass}>
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
