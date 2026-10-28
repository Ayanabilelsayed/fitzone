
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Dumbbell,
  Clock,
  Layers,
  RefreshCw,
  X,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import AdminSidebar from "@/app/Admin/components/AdminSidebar";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const emptyForm = {
  name: "",
  category: "",
  level: "",
  duration_minutes: "60",
  image_url: "",
};

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("fitzoneToken");
      const savedUser = sessionStorage.getItem("fitzoneUser");

      if (!token || !savedUser) {
        window.location.href = "/login";
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch {
        sessionStorage.removeItem("fitzoneUser");
        window.location.href = "/login";
        return;
      }

      if (user?.role !== "admin") {
        window.location.href = "/project";
        return;
      }

      const response = await fetch(`${API_BASE}/api/classes/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          data.message || "You are not authorized to manage classes."
        );
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to load classes.");
      }

      setClasses(Array.isArray(data.classes) ? data.classes : []);
      setAuthorized(true);
    } catch (err) {
      setError(err.message || "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchClasses() {
      if (cancelled) return;
      await loadClasses();
    }

    fetchClasses();

    return () => {
      cancelled = true;
    };
  }, [loadClasses]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEditClass(item) {
    setError("");
    setNotice("");

    setForm({
      name: item.name || "",
      category: item.category || "",
      level: item.level || "",
      duration_minutes: String(item.duration_minutes ?? 60),
      image_url: item.image_url || "",
    });

    setEditingId(item.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSaveClass(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.name.trim() || !form.category.trim()) {
      setError("Please enter the class name and category.");
      return;
    }

    const duration = Number(form.duration_minutes);

    if (!Number.isInteger(duration) || duration <= 0) {
      setError("Duration must be a positive number.");
      return;
    }

    const token = sessionStorage.getItem("fitzoneToken");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    const isEditing = editingId !== null;

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      level: form.level.trim(),
      duration_minutes: duration,
      image_url: form.image_url.trim(),
    };

    setSaving(true);

    try {
      const url = isEditing
        ? `${API_BASE}/api/classes/${editingId}`
        : `${API_BASE}/api/classes`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error || data.message || "Failed to save class."
        );
      }

      resetForm();

      setNotice(
        isEditing
          ? "Class updated successfully."
          : "Class added successfully."
      );

      await loadClasses();
    } catch (err) {
      setError(err.message || "Failed to save class.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteClass(classItem) {
    if (classItem.is_active === false) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove "${classItem.name}" from the public Classes page?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");
    setDeletingId(classItem.id);

    try {
      const token = sessionStorage.getItem("fitzoneToken");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(
        `${API_BASE}/api/classes/${classItem.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error || data.message || "Failed to delete class."
        );
      }

      setClasses((previous) =>
        previous.map((item) =>
          item.id === classItem.id
            ? { ...item, is_active: false }
            : item
        )
      );

      setNotice("Class removed from the public Classes page.");

      if (editingId === classItem.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Failed to delete class.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredClasses = classes.filter((item) => {
    const searchText = search.toLowerCase();

    return [item.name, item.category, item.level].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  });

  const activeCount = classes.filter(
    (item) => item.is_active !== false
  ).length;

  const inactiveCount = classes.filter(
    (item) => item.is_active === false
  ).length;

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#78A817] focus:ring-2 focus:ring-[#78A817]/20 dark:border-[#29342c] dark:bg-[#141a17] dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  if (!authorized && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-700 dark:bg-[#0b0f0d] dark:text-gray-200">
        <RefreshCw className="mr-3 animate-spin" size={20} />
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0f0d] dark:text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <Link
                  href="/Admin/Dashbord"
                  className="mb-3 inline-block text-sm text-gray-500 transition hover:text-[#78A817] dark:hover:text-[#C8FF3D]"
                >
                  Admin Dashboard / Classes
                </Link>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Manage{" "}
                  <span className="text-[#78A817] dark:text-[#C8FF3D]">
                    Classes
                  </span>
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Add, edit, search, and manage FITZONE classes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setNotice("");

                  if (showForm) {
                    resetForm();
                  } else {
                    setForm({ ...emptyForm });
                    setEditingId(null);
                    setShowForm(true);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#78A817] px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-[#C8FF3D] dark:text-black"
              >
                {showForm ? <X size={19} /> : <Plus size={19} />}
                {showForm ? "Close Form" : "Add Class"}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              >
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
              >
                <span>{notice}</span>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="Dismiss message"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                title="Total Classes"
                value={classes.length}
                icon={<Dumbbell size={21} />}
              />
              <StatCard
                title="Active Classes"
                value={activeCount}
                icon={<Layers size={21} />}
              />
              <StatCard
                title="Inactive Classes"
                value={inactiveCount}
                icon={<Clock size={21} />}
              />
            </div>

            {showForm && (
              <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#29342c] dark:bg-[#101612] sm:p-7">
                <div className="mb-6">
                  <h2 className="text-xl font-bold">
                    {editingId !== null ? "Edit Class" : "Add a New Class"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {editingId !== null
                      ? "Update the class information below."
                      : "Enter the class information below."}
                  </p>
                </div>

                <form onSubmit={handleSaveClass}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="name">
                        Class Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. Strength Training"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="category">
                        Category *
                      </label>
                      <input
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. Fitness"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="level">
                        Level
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={labelClass}
                        htmlFor="duration_minutes"
                      >
                        Duration (minutes) *
                      </label>
                      <input
                        id="duration_minutes"
                        name="duration_minutes"
                        type="number"
                        min="1"
                        value={form.duration_minutes}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="image_url">
                        Image URL
                      </label>
                      <div className="relative">
                        <ImageIcon
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          id="image_url"
                          name="image_url"
                          type="url"
                          value={form.image_url}
                          onChange={handleChange}
                          className={`${inputClass} pl-11`}
                          placeholder="https://example.com/class-image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#78A817] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#C8FF3D] dark:text-black"
                    >
                      {saving && (
                        <RefreshCw size={17} className="animate-spin" />
                      )}
                      {saving
                        ? "Saving..."
                        : editingId !== null
                          ? "Update Class"
                          : "Save Class"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setError("");
                      }}
                      disabled={saving}
                      className="rounded-xl border border-gray-200 px-6 py-3 font-semibold transition hover:bg-gray-100 disabled:opacity-50 dark:border-[#29342c] dark:hover:bg-[#1d2621]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#29342c] dark:bg-[#101612]">
              <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-[#29342c] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">All Classes</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {filteredClasses.length} class
                    {filteredClasses.length === 1 ? "" : "es"} found
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search classes..."
                      className={`${inputClass} pl-10 sm:w-64`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={loadClasses}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50 dark:border-[#29342c] dark:hover:bg-[#1d2621]"
                  >
                    <RefreshCw
                      size={17}
                      className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
                  <RefreshCw size={20} className="animate-spin" />
                  Loading classes...
                </div>
              ) : filteredClasses.length === 0 ? (
                <div className="p-12 text-center">
                  <Dumbbell
                    size={35}
                    className="mx-auto mb-3 text-gray-400"
                  />
                  <h3 className="font-semibold">No classes found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add a class or try another search.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-[#141a17] dark:text-gray-400">
                      <tr>
                        <th className="px-5 py-4">Class</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Level</th>
                        <th className="px-5 py-4">Duration</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-[#29342c]">
                      {filteredClasses.map((item) => {
                        const isDeleted = item.is_active === false;

                        return (
                          <tr
                            key={item.id}
                            className={`transition hover:bg-gray-50 dark:hover:bg-[#141a17] ${
                              isDeleted ? "opacity-70" : ""
                            }`}
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className={`h-11 w-11 rounded-xl object-cover ${
                                      isDeleted ? "grayscale" : ""
                                    }`}
                                  />
                                ) : (
                                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#78A817]/10 text-[#78A817] dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
                                    <Dumbbell size={20} />
                                  </div>
                                )}

                                <span
                                  className={`font-semibold ${
                                    isDeleted
                                      ? "text-gray-500 line-through"
                                      : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {item.name}
                                </span>
                              </div>
                            </td>

                            <td
                              className={`px-5 py-4 ${
                                isDeleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {item.category || "—"}
                            </td>

                            <td
                              className={`px-5 py-4 ${
                                isDeleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {item.level || "—"}
                            </td>

                            <td
                              className={`px-5 py-4 ${
                                isDeleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {item.duration_minutes
                                ? `${item.duration_minutes} min`
                                : "—"}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  isDeleted
                                    ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                                }`}
                              >
                                {isDeleted ? "Deleted" : "Active"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditClass(item)}
                                  disabled={saving || deletingId === item.id}
                                  aria-label={`Edit ${item.name}`}
                                  title="Edit class"
                                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#78A817] hover:bg-gray-50 hover:text-[#78A817] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29342c] dark:text-gray-300 dark:hover:border-[#C8FF3D] dark:hover:text-[#C8FF3D]"
                                >
                                  <Pencil size={17} />
                                </button>

                                {!isDeleted && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteClass(item)}
                                    disabled={deletingId === item.id}
                                    aria-label={`Remove ${item.name}`}
                                    title="Remove class"
                                    className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/40"
                                  >
                                    {deletingId === item.id ? (
                                      <RefreshCw
                                        size={17}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2 size={17} />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <p className="mt-5 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Removing a class marks it as inactive. It stays in the database
              but no longer appears on the public Classes page. Deleted
              classes remain editable from this dashboard.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#29342c] dark:bg-[#101612]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#78A817]/10 text-[#78A817] dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
          {icon}
        </div>
      </div>
    </div>
  );
}
