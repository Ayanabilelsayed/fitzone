"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const {
      fullName,
      email,
      password,
      confirmPassword,
      acceptTerms,
    } = formData;

    if (fullName.trim() === "") {
      alert("Please enter your full name");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      alert("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      alert("Password must contain at least one number");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    router.push("/Home");
    //////////////////////////////////////// Temporary until the backend is connected
    
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-3 sm:px-6"
      style={{ backgroundImage: "url('/login.png')" }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <section className="relative z-10 mx-auto w-full max-w-lg rounded-2xl border border-white/20 bg-[#0b0f0d]/95 p-5 text-white shadow-[0_0_30px_rgba(200,255,61,0.12),0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-6">
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="text-2xl font-black tracking-wider text-[#C8FF3D]"
          >
            FITZONE
          </Link>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Create Account
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Start your fitness journey with us
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-200"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
              className="w-full rounded-lg border border-white/15 bg-[#141a17] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-200"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full rounded-lg border border-white/15 bg-[#141a17] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-200"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-white/15 bg-[#141a17] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />

            <p className="mt-1 text-xs text-gray-500">
              At least 8 characters, including uppercase, lowercase, and a
              number.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-200"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-white/15 bg-[#141a17] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              className="mt-1 h-4 w-4 shrink-0 accent-[#C8FF3D]"
            />

            <label
              htmlFor="acceptTerms"
              className="text-xs leading-5 text-gray-400"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-[#C8FF3D] hover:underline"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#C8FF3D] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"

            className="w-full rounded-lg bg-[#C8FF3D] py-3 font-bold text-[#0b0f0d] transition hover:bg-[#b5eb2e] active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#C8FF3D] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}
