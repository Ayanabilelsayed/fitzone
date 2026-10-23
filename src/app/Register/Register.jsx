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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
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

    if (!email.trim()) {
      alert("Please enter your email address");
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

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            password,
            confirmPassword,
            termsAccepted: acceptTerms,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // Save user information for the Header
      if (data.user) {
        sessionStorage.setItem(
          "fitzoneUser",
          JSON.stringify(data.user)
        );

        window.dispatchEvent(new Event("fitzone-auth-changed"));
      } else {
        // Registration succeeded, but the API did not return user data.
        // The user can sign in to load their account information.
        alert("Account created successfully! Please sign in.");
        router.push("/login");
        return;
      }

      alert("Account created successfully!");
      router.push("/project");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Could not connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-white/15 bg-[#141a17] py-2.5 pl-4 pr-12 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 transition hover:text-[#C8FF3D] focus:outline-none focus:text-[#C8FF3D]"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A11.3 11.3 0 0112 5c5.5 0 9 7 9 7a15.7 15.7 0 01-3.1 3.9" />
                    <path d="M6.2 6.2C3.9 7.7 2 12 2 12s3.5 7 10 7a10.8 10.8 0 004.1-.8" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

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

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-white/15 bg-[#141a17] py-2.5 pl-4 pr-12 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 transition hover:text-[#C8FF3D] focus:outline-none focus:text-[#C8FF3D]"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A11.3 11.3 0 0112 5c5.5 0 9 7 9 7a15.7 15.7 0 01-3.1 3.9" />
                    <path d="M6.2 6.2C3.9 7.7 2 12 2 12s3.5 7 10 7a10.8 10.8 0 004.1-.8" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
                href="/terms#privacy"
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
            disabled={isLoading}
            className="w-full rounded-lg bg-[#C8FF3D] py-3 font-bold text-[#0b0f0d] transition hover:bg-[#b5eb2e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
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