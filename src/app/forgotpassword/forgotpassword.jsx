
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";


export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  
const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setMessage("");

  if (!token) {
    setError("Reset token is missing. Please request a new link.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const data = await apiRequest("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        password,
        confirmPassword,
      }),
    });

    setMessage(data.message || "Password reset successfully.");
    setPassword("");
    setConfirmPassword("");
  } catch (err) {
    setError(err.message || "Unable to reset password.");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f0d] px-4 py-10 text-white">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/login.png')" }}
        />
        <div className="absolute inset-0 bg-[#0b0f0d]/85" />
      </div>

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#141a17]/95 p-7 shadow-2xl sm:p-9">
        <Link
          href="/login"
          className="text-sm text-gray-400 transition hover:text-[#C8FF3D]"
        >
          ← Back to Login
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Reset Password
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Choose a new password for your FITZONE account.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-white/10 bg-[#0b0f0d] px-4 py-3 outline-none transition focus:border-[#C8FF3D] disabled:opacity-60"
            />
            <p className="mt-2 text-xs text-gray-500">
              At least 8 characters, including uppercase,
              lowercase, and a number.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-white/10 bg-[#0b0f0d] px-4 py-3 outline-none transition focus:border-[#C8FF3D] disabled:opacity-60"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg border border-[#C8FF3D]/20 bg-[#C8FF3D]/10 p-3 text-sm text-[#C8FF3D]"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-lg bg-[#C8FF3D] px-4 py-3 font-bold text-[#0b0f0d] transition hover:bg-[#b7eb32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {message && (
          <Link
            href="/login"
            className="mt-5 block text-center text-sm font-semibold text-[#C8FF3D] hover:underline"
          >
            Go to Login
          </Link>
        )}
      </section>
    </main>
  );
}
