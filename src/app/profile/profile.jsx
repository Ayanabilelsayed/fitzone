
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Fetch Profile
  const fetchProfile = useCallback(async (signal) => {
    try {
      const token = sessionStorage.getItem("fitzoneToken");

      if (!token) {
        router.push("/login");
        return;
      }

      const data = await apiRequest("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (signal?.aborted) return;

      setUser(data.user);

      setFormData({
        fullName: data.user.full_name || "",
        email: data.user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      if (signal?.aborted) return;

      console.error("Profile error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [router]);

 // Load Profile
useEffect(() => {
  const controller = new AbortController();

  const loadProfile = async () => {
    await fetchProfile(controller.signal);
  };

  loadProfile();

  return () => {
    controller.abort();
  };
}, [fetchProfile]);


  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      fullName: user.full_name || "",
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  // Save Profile
  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Name and email are required");
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setError("Please enter your current password");
      return;
    }

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      setError("New passwords do not match");
      return;
    }

    try {
      setSaving(true);

      const token = sessionStorage.getItem("fitzoneToken");

      if (!token) {
        router.push("/login");
        return;
      }

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      };

      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
        payload.confirmNewPassword = formData.confirmNewPassword;
      }

      const data = await apiRequest("/api/auth/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Update Profile State
      setUser(data.user);

      // Update Session Storage
      const storedUser = JSON.parse(
        sessionStorage.getItem("fitzoneUser") || "{}"
      );

      sessionStorage.setItem(
        "fitzoneUser",
        JSON.stringify({
          ...storedUser,
          ...data.user,
          fullName: data.user.full_name,
          email: data.user.email,
        })
      );

      // Notify Header
      window.dispatchEvent(new Event("fitzone-auth-changed"));

      // Reset Form
      setFormData({
        fullName: data.user.full_name,
        email: data.user.email,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setSuccess("Your profile has been updated successfully!");
      setEditing(false);

    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-900 dark:bg-[#0b0f0d] dark:text-white">
        Loading profile...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-gray-900 dark:bg-[#0b0f0d] dark:text-white">
        <p>{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#c8ff3d] px-5 py-2 font-semibold text-black"
        >
          Try Again
        </button>

        <button
          onClick={() => router.push("/project")}
          className="text-sm text-[#78A817] underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!user) return null;

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-900 outline-none transition focus:border-[#78A817] focus:ring-2 focus:ring-[#78A817]/20 dark:border-[#26312b] dark:bg-[#1d2621] dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-600 dark:text-[#9ba7a0]";

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12 text-gray-900 transition-colors dark:bg-[#0b0f0d] dark:text-white">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#78A817]">
              FITZONE MEMBER
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              My Profile
            </h1>

            <p className="mt-2 text-gray-500 dark:text-[#9ba7a0]">
              Manage your personal information and fitness journey.
            </p>
          </div>

          {/* Back to Home Button */}
          <button
            onClick={() => router.push("/project")}
            className="rounded-xl border border-gray-300 px-5 py-3 font-semibold transition hover:bg-gray-100 dark:border-[#39463e] dark:hover:bg-[#1d2621]"
          >
            ← Back to Home
          </button>

        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#26312b] dark:bg-[#141a17]">

          {/* User Info */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c8ff3d] text-2xl font-bold text-black">
                {user.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {user.full_name}
                </h2>

                <p className="text-sm text-gray-500 dark:text-[#9ba7a0]">
                  {user.email}
                </p>
              </div>
            </div>

            {!editing && (
              <button
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setEditing(true);
                }}
                className="rounded-xl bg-[#c8ff3d] px-5 py-3 font-semibold text-black transition hover:bg-[#b5ed2d]"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="mb-8 border-t border-gray-200 dark:border-[#26312b]" />

          {/* Edit Form */}
          {editing ? (
            <form onSubmit={handleSave} className="space-y-6">

              <h3 className="text-lg font-bold">
                Personal Information
              </h3>

              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label className={labelClass}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your email"
                    required
                  />
                </div>

              </div>

              {/* Change Password */}
              <div className="border-t border-gray-200 pt-6 dark:border-[#26312b]">

                <h3 className="mb-2 text-lg font-bold">
                  Change Password
                </h3>

                <p className="mb-6 text-sm text-gray-500 dark:text-[#9ba7a0]">
                  Leave these fields empty if you do not want to change your password.
                </p>

                <div className="grid gap-6 sm:grid-cols-2">

                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Current Password
                    </label>

                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      New Password
                    </label>

                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                  </div>

                </div>

                <p className="mt-3 text-xs text-gray-500 dark:text-[#9ba7a0]">
                  Password must contain at least 8 characters, including uppercase, lowercase, and a number.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6 dark:border-[#26312b]">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#c8ff3d] px-6 py-3 font-bold text-black transition hover:bg-[#b5ed2d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100 dark:border-[#39463e] dark:hover:bg-[#1d2621]"
                >
                  Cancel
                </button>

              </div>
            </form>
          ) : (

            /* View Profile */
            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <p className={labelClass}>Full Name</p>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-[#26312b] dark:bg-[#1d2621]">
                  {user.full_name}
                </div>
              </div>

              <div>
                <p className={labelClass}>Email Address</p>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-[#26312b] dark:bg-[#1d2621]">
                  {user.email}
                </div>
              </div>

              <div>
                <p className={labelClass}>Account Type</p>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 capitalize dark:border-[#26312b] dark:bg-[#1d2621]">
                  {user.role}
                </div>
              </div>

              <div>
                <p className={labelClass}>Member Since</p>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-[#26312b] dark:bg-[#1d2621]">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Not available"}
                </div>
              </div>

            </div>
          )}

        </section>
      </div>
    </main>
  );
}
