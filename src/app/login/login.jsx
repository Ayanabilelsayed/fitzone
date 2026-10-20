"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    // Temporary until we connect the backend API
    console.log({ email, password });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0f0d] px-4 py-8 text-white sm:px-6">
  
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141a17] p-6 shadow-2xl shadow-black/30 sm:p-8 md:p-10">
       
        <Link
          href="/"
          className="mb-8 block text-center text-3xl font-black tracking-wider"
        >
          FIT<span className="text-[#c8ff3d]">ZONE</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Sign in to continue your fitness journey.
          </p>
        </div>

      
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-200"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#0b0f0d] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-[#c8ff3d] focus:ring-1 focus:ring-[#c8ff3d]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-200"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() =>
                  alert("Password reset will be connected later.")
                }
                className="text-xs font-semibold text-[#c8ff3d] transition hover:text-white"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="w-full rounded-xl border border-white/10 bg-[#0b0f0d] px-4 py-3.5 pr-16 text-white outline-none transition placeholder:text-gray-600 focus:border-[#c8ff3d] focus:ring-1 focus:ring-[#c8ff3d]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition hover:text-[#c8ff3d]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-400">
            <input
              type="checkbox"
              
              className="h-4 w-4 accent-[#c8ff3d]"
            />
            Remember me
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#c8ff3d] px-5 py-3.5 font-black uppercase tracking-wider text-[#0b0f0d] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#c8ff3d] focus:ring-offset-2 focus:ring-offset-[#141a17]"
          >
            Sign In →
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-7 text-center text-sm text-gray-400">
             Don&apos;t have an account?{" "}
          <Link
            href="/Register"
            className="font-bold text-[#c8ff3d] transition hover:text-white"
          >
            Create account
          </Link>
        </p>

        <p className="mt-7 text-center text-xs leading-6 text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}
