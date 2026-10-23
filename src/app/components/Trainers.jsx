
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const response = await fetch("http://localhost:5000/api/trainers");

        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }

        const data = await response.json();
        setTrainers(data.trainers);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Could not load trainers. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrainers();
  }, []);

  return (
    <section
      id="trainers"
      className="w-full bg-[var(--background)] px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Meet the Team
          </p>

          <h1 className="text-3xl font-extrabold text-[var(--text)] sm:text-4xl">
            Our Elite Trainers
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-secondary)]">
            Work directly with professional coaches to reach your fitness goals.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="py-10 text-center text-[var(--text-secondary)]">
            Loading trainers...
          </p>
        )}

        {/* Error State */}
        {!loading && error && (
          <p className="py-10 text-center text-red-500">{error}</p>
        )}

        {/* Empty State */}
        {!loading && !error && trainers.length === 0 && (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]">
            <p className="text-center text-sm text-[var(--text-muted)]">
              No trainers available yet.
            </p>
          </div>
        )}

        {/* Trainers from Backend */}
        {!loading && !error && trainers.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.map((trainer) => (
              <article
                key={trainer.id}
                className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-300 hover:-translate-y-2 hover:border-[var(--primary)] hover:shadow-xl"
              >
                {/* Trainer Image */}
                <div className="overflow-hidden">
                  {trainer.image_url ? (
                    <Image
                      src={trainer.image_url}
                      alt={trainer.name}
                      width={600}
                      height={400}
                      className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-[var(--surface-light)] text-[var(--text-muted)]">
                      No image available
                    </div>
                  )}
                </div>

                {/* Trainer Information */}
                <div className="p-5">
                  <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--primary)]">
                    {trainer.role}
                  </p>

                  <h2 className="text-xl font-bold text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--primary)]">
                    {trainer.name}
                  </h2>

                  {trainer.experience && (
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {trainer.experience}
                    </p>
                  )}

                  {/* View Profile Button */}
                  <div className="mt-6 flex justify-center">
                    <Link
                      href={`/Trainers/${trainer.id}`}
                      className="group/btn inline-flex items-center justify-center gap-2 rounded-full border border-[var(--primary)] px-6 py-2.5 text-sm font-bold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--background)] hover:shadow-lg hover:shadow-[var(--primary)]/20"
                    >
                      <span>View Profile</span>

                      <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
