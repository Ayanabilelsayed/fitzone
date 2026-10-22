"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (email.trim() === "") {
      alert("Please enter your email address");
      return;
    }

    // TODO: Connect to the backend to send a password reset email
    alert("Password reset functionality will be available soon.");
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-6"
      style={{ backgroundImage: "url('/login.png')" }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-[#0b0f0d]/95 p-6 text-white shadow-[0_0_30px_rgba(200,255,61,0.12),0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-8">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-2xl font-black tracking-wider text-[#C8FF3D]"
          >
            FITZONE
          </Link>

          <div className="mx-auto mb-4 mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C8FF3D]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-[#C8FF3D]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v6A2.25 2.25 0 0 1 17.25 21h-10.5A2.25 2.25 0 0 1 4.5 18.75v-6A2.25 2.25 0 0 1 6.75 10.5Z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Don&apos;t worry! Enter your email address and we&apos;ll help you
            reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-lg border border-white/15 bg-[#141a17] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#C8FF3D] py-3 font-bold text-[#0b0f0d] transition hover:bg-[#b5eb2e] active:scale-[0.98]"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#C8FF3D] hover:underline"
          >
            Sign In
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-500 transition hover:text-[#C8FF3D]"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}
