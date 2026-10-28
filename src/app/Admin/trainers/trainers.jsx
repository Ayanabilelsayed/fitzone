
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/app/Admin/components/AdminSidebar";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const emptyForm = {
  name: "",
  role: "",
  experience: "",
  image_url: "",
  bio: "",
};

async function adminRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem("fitzoneToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        data.message || "Access denied. Please log in with an admin account."
      );
    }

    throw new Error(
      data.message || `Request failed with status ${response.status}.`
    );
  }

  return data;
}

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const request = useCallback((endpoint, options = {}) => {
    return adminRequest(endpoint, options);
  }, []);

  const loadTrainers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("/api/trainers/admin");
      setTrainers(Array.isArray(data.trainers) ? data.trainers : []);
    } catch (err) {
      setError(err.message || "Could not load trainers.");
    } finally {
      setLoading(false);
    }
  }, [request]);

 useEffect(() => {
  async function fetchTrainers() {
    setLoading(true);
    setError("");

    try {
      const data = await adminRequest("/api/trainers/admin");
      setTrainers(data.trainers || []);
    } catch (err) {
      setError(err.message || "Could not load trainers.");
    } finally {
      setLoading(false);
    }
  }

  fetchTrainers();
}, []);
  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (trainer) => {
    setEditingId(trainer.id);
    setForm({
      name: trainer.name || "",
      role: trainer.role || "",
      experience:
        trainer.experience === null || trainer.experience === undefined
          ? ""
          : String(trainer.experience),
      image_url: trainer.image_url || "",
      bio: trainer.bio || "",
    });
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const experienceText = form.experience.trim();
      const experienceNumber = Number(experienceText);

      if (!form.name.trim() || !form.role.trim()) {
        throw new Error("Trainer name and role are required.");
      }

      if (
        experienceText !== "" &&
        (!Number.isInteger(experienceNumber) || experienceNumber < 0)
      ) {
        throw new Error(
          "Experience must be a whole number of years, such as 5."
        );
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        experience: experienceText === "" ? 0 : experienceNumber,
        image_url: form.image_url.trim(),
        bio: form.bio.trim(),
      };

      const data = await request(
        editingId
          ? `/api/trainers/${editingId}`
          : "/api/trainers",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        data.message ||
          (editingId
            ? "Trainer updated successfully."
            : "Trainer added successfully.")
      );

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await loadTrainers();
    } catch (err) {
      setError(err.message || "Could not save trainer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (trainer) => {
    if (processingId !== null) return;

    const isActive = trainer.is_active !== false;
    const actionText = isActive ? "deactivate" : "restore";

    const confirmed = window.confirm(
      isActive
        ? `Deactivate ${trainer.name}? They will disappear from the public trainers page.`
        : `Restore ${trainer.name} and show them on the public trainers page?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setProcessingId(trainer.id);

    try {
      const data = await request(`/api/trainers/${trainer.id}`, {
        method: "DELETE",
      });

      setMessage(
        data.message ||
          (actionText === "deactivate"
            ? "Trainer deactivated successfully."
            : "Trainer restored successfully.")
      );

      await loadTrainers();
    } catch (err) {
      setError(err.message || "Could not update trainer status.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTrainers = trainers.filter((trainer) =>
    `${trainer.name || ""} ${trainer.role || ""} ${trainer.experience ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const activeCount = trainers.filter(
    (trainer) => trainer.is_active !== false
  ).length;

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--primary)]";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] md:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                FITZONE Management
              </p>

              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Trainers
              </h1>

              <p className="mt-2 text-[var(--text-secondary)]">
                Manage your gym trainers and their profiles.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="rounded-xl bg-[var(--primary)] px-5 py-3 font-bold text-[var(--background)] transition hover:opacity-85"
            >
              + Add Trainer
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">
                Total Trainers
              </p>
              <p className="mt-2 text-3xl font-extrabold">
                {trainers.length}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">
                Active Trainers
              </p>
              <p className="mt-2 text-3xl font-extrabold text-[var(--primary)]">
                {activeCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">
                Inactive Trainers
              </p>
              <p className="mt-2 text-3xl font-extrabold">
                {trainers.length - activeCount}
              </p>
            </div>
          </div>

          {message && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-600"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-500"
            >
              <p>{error}</p>

              {!trainers.length && !loading && (
                <button
                  type="button"
                  onClick={loadTrainers}
                  className="mt-3 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-bold hover:bg-red-500/10"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {showForm && (
            <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Trainer" : "Add New Trainer"}
                </h2>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-light)] disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Full Name *
                    </span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Trainer name"
                      required
                      maxLength={150}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Role / Specialization *
                    </span>
                    <input
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. Personal Trainer"
                      required
                      maxLength={150}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Experience (years)
                    </span>
                    <input
                      name="experience"
                      type="number"
                      min="0"
                      step="1"
                      value={form.experience}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. 5"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Image URL
                    </span>
                    <input
                      name="image_url"
                      type="url"
                      value={form.image_url}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="https://example.com/trainer.jpg"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">
                    Biography
                  </span>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={2000}
                    className={inputClass}
                    placeholder="Write a short trainer biography..."
                  />
                </label>

                {form.image_url && (
                  <div>
                    <p className="mb-2 text-sm text-[var(--text-secondary)]">
                      Image preview
                    </p>

                    <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-[var(--border)]">
                      <Image
                        src={form.image_url}
                        alt="Trainer preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[var(--primary)] px-6 py-3 font-bold text-[var(--background)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Add Trainer"}
                </button>
              </form>
            </section>
          )}

          <section className="mt-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold">All Trainers</h2>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search trainers..."
                aria-label="Search trainers"
                className={`${inputClass} sm:max-w-xs`}
              />
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] py-16 text-center text-[var(--text-secondary)]">
                Loading trainers...
              </div>
            ) : filteredTrainers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)] py-16 text-center text-[var(--text-secondary)]">
                {search
                  ? "No trainers match your search."
                  : "No trainers found."}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTrainers.map((trainer) => {
                  const inactive = trainer.is_active === false;

                  return (
                    <article
                      key={trainer.id}
                      className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] ${
                        inactive ? "opacity-75" : ""
                      }`}
                    >
                      <div className="relative h-56 bg-[var(--surface-light)]">
                        {trainer.image_url ? (
                          <Image
                            src={trainer.image_url}
                            alt={trainer.name || "Trainer"}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className={`object-cover ${
                              inactive ? "grayscale" : ""
                            }`}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
                            No image available
                          </div>
                        )}

                        <span
                          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                            inactive
                              ? "bg-red-500/15 text-red-500"
                              : "bg-green-500/15 text-green-600"
                          }`}
                        >
                          {inactive ? "Inactive" : "Active"}
                        </span>
                      </div>

                      <div className="p-5">
                        <p className="text-sm font-bold text-[var(--primary)]">
                          {trainer.role}
                        </p>

                        <h3 className="mt-2 text-xl font-extrabold">
                          {trainer.name}
                        </h3>

                        {trainer.experience !== null &&
                          trainer.experience !== undefined &&
                          trainer.experience !== "" && (
                            <p className="mt-2 text-sm text-[var(--text-secondary)]">
                              {trainer.experience} years of experience
                            </p>
                          )}

                        {trainer.bio && (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                            {trainer.bio}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(trainer)}
                            className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-bold transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(trainer)}
                            disabled={processingId !== null}
                            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              inactive
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            }`}
                          >
                            {processingId === trainer.id
                              ? "Please wait..."
                              : inactive
                                ? "Restore"
                                : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
