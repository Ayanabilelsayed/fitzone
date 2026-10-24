"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

export default function Header() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    function updateUserName() {
      try {
        const storedUser = sessionStorage.getItem("fitzoneUser");

        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.full_name || user.fullName || user.name || "");
        } else {
          setUserName("");
        }
      } catch (error) {
        console.error("Could not read user data:", error);
        setUserName("");
      }
    }

    updateUserName();

    window.addEventListener("fitzone-auth-changed", updateUserName);

    return () => {
      window.removeEventListener("fitzone-auth-changed", updateUserName);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--header-bg)] border-b border-[var(--border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/project#home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center font-black text-xl text-[var(--button-text)] shadow-md group-hover:scale-105 transition-transform">
            FZ
          </div>

          <span className="font-extrabold text-2xl tracking-tight text-[var(--text)]">
            FITZONE<span className="text-[var(--primary)]">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[var(--text-secondary)]">
          <Link href="/project#home" className="hover:text-[var(--primary)] transition-colors">
            Home
          </Link>

          <Link href="/project#classes" className="hover:text-[var(--primary)] transition-colors">
            Classes
          </Link>

          <Link href="/project#trainers" className="hover:text-[var(--primary)] transition-colors">
            Trainers
          </Link>

          <Link href="/project#membership" className="hover:text-[var(--primary)] transition-colors">
            Membership
          </Link>

          <Link href="/project#contact" className="hover:text-[var(--primary)] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

{userName ? (
  <Link
    href="/Profile"
    className="hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--primary)]"
  >
    Hi, {userName}
  </Link>
) : (
  <Link
    href="/login"
    className="hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--primary)]"
  >
    Sign In
  </Link>
)}

<Link
  href="/project#membership"
  className="inline-flex items-center justify-center rounded-lg bg-[var(--button-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] shadow-md transition-all duration-200 hover:bg-[var(--primary-hover)] hover:shadow-lg"
>
  Join Now
</Link>

        </div>
      </div>
    </header>
  );
}