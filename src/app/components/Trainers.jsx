"use client";

import Link from "next/link";

const trainers = [
  { id: 1, name: "Marcus Vance", role: "Head Strength Coach", exp: "8+ Years Experience", image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Elena Rostova", role: "Yoga & Mindfulness Lead", exp: "6+ Years Experience", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "David Miller", role: "HIIT & CrossFit Specialist", exp: "5+ Years Experience", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "Sarah Jenkins", role: "Pilates & Core Instructor", exp: "7+ Years Experience", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600" },
];

export default function Trainers() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold text-[var(--text)]">Our Elite Trainers</h1>
        <p className="text-[var(--text-muted)] mt-2">Work directly with certified professional coaches.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden p-6 text-center space-y-4 hover:border-[var(--primary)] transition-all">
            <img src={trainer.image} alt={trainer.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[var(--primary-soft)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text)]">{trainer.name}</h3>
              <p className="text-xs font-semibold text-[var(--primary)] mt-0.5">{trainer.role}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{trainer.exp}</p>
            </div>
            <Link
              href={`/Trainers/${trainer.id}`}
              className="inline-block w-full py-2 rounded-xl text-xs font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}