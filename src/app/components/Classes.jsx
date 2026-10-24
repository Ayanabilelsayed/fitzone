
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function Classes() {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchClasses() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/api/classes", {
          signal: controller.signal,
        });

        if (!data.success) {
          throw new Error(data.message || "Failed to load classes.");
        }

        setClasses(Array.isArray(data.classes) ? data.classes : []);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Fetch classes error:", err);

        setError(
          err instanceof TypeError
            ? "Cannot connect to the server. Please make sure the backend is running."
            : err.message || "Something went wrong while loading classes."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchClasses();

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(classes.map((item) => item.category))],
    [classes]
  );

  const filteredClasses = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return classes.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm);

      const matchesFilter =
        filter === "All" || item.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [classes, search, filter]);

  function handleBooking(item) {
    // Pass the selected workout to the booking page.
    const params = new URLSearchParams({
      workout: item.name,
    });

    router.push(`/plan?${params.toString()}`);
  }

  return (
    <section
      id="classes"
      className="scroll-mt-24 bg-[var(--background)] py-16 text-[var(--text)] transition-colors duration-300 sm:py-20"
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
            Train Your Way
          </p>

          <h2 className="text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
            Fitness Classes
          </h2>

          <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
            Find your favorite workout, explore different training styles, and
            take the next step toward your fitness goals.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="search"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search fitness classes"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--primary)] sm:max-w-md"
          />

          <div
            className="flex gap-2 overflow-x-auto pb-2"
            aria-label="Filter classes by category"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  filter === category
                    ? "bg-[var(--button-bg)] text-[var(--button-text)]"
                    : "border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div
            className="rounded-2xl border border-[var(--border)] px-6 py-12 text-center text-[var(--text-secondary)]"
            role="status"
          >
            Loading classes...
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border border-red-500/40 px-6 py-12 text-center"
            role="alert"
          >
            <h3 className="text-xl font-bold text-[var(--text)]">
              Unable to load classes
            </h3>

            <p className="mt-2 text-[var(--text-secondary)]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[var(--button-bg)] px-5 py-3 font-bold text-[var(--button-text)]"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--text-muted)]">
              Showing {filteredClasses.length}{" "}
              {filteredClasses.length === 1 ? "class" : "classes"}
            </p>

            {filteredClasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClasses.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={600}
                          height={400}
                          loading="lazy"
                          unoptimized
                          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-52 items-center justify-center bg-[var(--surface-light)] text-[var(--text-muted)]">
                          No image available
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white">
                        {item.category}
                      </span>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                      <div>
                        <p className="mb-2 text-sm text-[var(--text-muted)]">
                          {item.level}
                        </p>

                        <h3 className="text-xl font-bold text-[var(--text)]">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                        <span className="text-sm text-[var(--text-secondary)]">
                          {item.duration_minutes} mins
                        </span>

                        <button
                          type="button"
                          onClick={() => handleBooking(item)}
                          className="rounded-xl bg-[var(--button-bg)] px-4 py-2.5 text-sm font-bold text-[var(--button-text)] transition hover:brightness-110"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] px-6 py-12 text-center">
                <h3 className="text-xl font-bold text-[var(--text)]">
                  No classes found
                </h3>

                <p className="mt-2 text-[var(--text-secondary)]">
                  Try another search term or choose a different category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                  className="mt-5 rounded-xl bg-[var(--button-bg)] px-5 py-3 font-bold text-[var(--button-text)]"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
