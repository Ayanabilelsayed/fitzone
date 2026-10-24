
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

function TrainerDetailsContent() {
  const params = useParams();
  const id = params.id;

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrainer() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/api/trainers/${id}`);
        setTrainer(data.trainer);
      } catch (err) {
        console.error("Error fetching trainer:", err);
        setError(err.message || "Could not load trainer.");
        setTrainer(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTrainer();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--text)]">
        Loading trainer...
      </main>
    );
  }

  if (error || !trainer) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] px-4 text-center">
        <h1 className="text-2xl font-bold text-[var(--text)]">
          Trainer Not Found
        </h1>

        <p className="text-[var(--text-secondary)]">
          {error || "This trainer is not available."}
        </p>

        <Link
          href="/project"
          className="rounded-full bg-[var(--primary)] px-6 py-3 font-bold text-[var(--background)] transition hover:opacity-80"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-16 text-[var(--text)] transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/project"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-[var(--primary)] transition hover:gap-3"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>

        <section className="grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] md:grid-cols-2">
          <div className="relative min-h-[350px] overflow-hidden sm:min-h-[500px]">
            {trainer.image_url ? (
              <Image
                src={trainer.image_url}
                alt={trainer.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full min-h-[350px] items-center justify-center bg-[var(--surface-light)] text-[var(--text-muted)]">
                No image available
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Meet Your Trainer
            </p>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              {trainer.name}
            </h1>

            <p className="mt-3 text-lg font-semibold text-[var(--primary)]">
              {trainer.role}
            </p>

            {trainer.experience && (
              <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface-light)] p-4">
                <p className="text-sm text-[var(--text-muted)]">
                  Experience
                </p>
                <p className="mt-1 font-bold">{trainer.experience}</p>
              </div>
            )}

            {trainer.bio && (
              <div className="mt-6">
                <h2 className="text-xl font-bold">About the Trainer</h2>
                <p className="mt-3 leading-7 text-[var(--text-secondary)]">
                  {trainer.bio}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function TrainerDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--text)]">
          Loading trainer...
        </main>
      }
    >
      <TrainerDetailsContent />
    </Suspense>
  );
}
