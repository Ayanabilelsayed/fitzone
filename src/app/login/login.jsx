"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
async function handleSubmit(event) {
  event.preventDefault();

  if (!email.trim() || !password) {
    alert("Please fill in all fields");
    return;
  }

  setIsLoading(true);

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!data.user) {
      alert("Login succeeded, but user information was not returned.");
      return;
    }

    // Save user information
    sessionStorage.setItem("fitzoneUser", JSON.stringify(data.user));

    // Save authentication token
    if (data.token) {
      sessionStorage.setItem("fitzoneToken", data.token);
    }

    // Notify the Header
    window.dispatchEvent(new Event("fitzone-auth-changed"));

    alert("Login successful!");

    // Redirect based on user role
    if (data.user.role === "admin") {
      router.push("/Admin/Dashbord");
    } else {
      router.push("/project");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Could not connect to the server.");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-6"
      style={{
        backgroundImage: "url('/login.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login container */}
      <section className="relative z-10 mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-[#0b0f0d]/95 p-6 text-white shadow-[0_0_30px_rgba(200,255,61,0.12),0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-8">
        {/* Logo */}
        <Link
          href="/"
          className="mb-6 block text-center text-3xl font-black tracking-wider text-white"
        >
          FIT<span className="text-[#C8FF3D]">ZONE</span>
        </Link>

        {/* Heading */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-black text-white sm:text-3xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#C5CEC8]">
            Sign in to continue your fitness journey.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-[#2A352F] bg-[#1D2621] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#A5B0A8] focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-[#2A352F] bg-[#1D2621] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-[#A5B0A8] focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-[#A5B0A8] transition hover:text-[#C8FF3D] focus:outline-none focus:text-[#C8FF3D]"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
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
                    width="21"
                    height="21"
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

            <div className="mt-2 text-right">
              <Link
                href="/forgotpassword"
                className="text-xs font-semibold text-[#C8FF3D] transition hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex cursor-pointer items-center gap-3 text-sm text-[#C5CEC8]">
            <input
              type="checkbox"
              name="remember"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 accent-[#C8FF3D]"
            />
            Remember me
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#C8FF3D] px-5 py-3.5 font-black uppercase tracking-wider text-[#0B0F0D] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8FF3D] focus:ring-offset-2 focus:ring-offset-[#141A17] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm leading-6 text-[#C5CEC8]">
          Don&apos;t have an account?{" "}
          <Link
            href="/Register"
            className="font-bold text-[#C8FF3D] transition hover:text-white"
          >
            Create account
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-5 text-center text-xs leading-5 text-[#A5B0A8]">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}