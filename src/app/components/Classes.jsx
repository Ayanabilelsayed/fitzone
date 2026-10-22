"use client";

import { useState } from "react";
import Link from "next/link";

const allClasses = [
  { id: 1, name: "HIIT & Cardio Flow", category: "Cardio", level: "All Levels", duration: "45 mins", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Power Bodybuilding", category: "Strength", level: "Advanced", duration: "60 mins", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Vinyasa Power Yoga", category: "Flexibility", level: "Beginner", duration: "50 mins", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "CrossFit Core Blast", category: "Strength", level: "Intermediate", duration: "45 mins", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600" },
  { id: 5, name: "Spinning & Cycling", category: "Cardio", level: "All Levels", duration: "45 mins", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=600" },
  { id: 6, name: "Boxing Conditioning", category: "Cardio", level: "Intermediate", duration: "60 mins", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=600" },
];

export default function Classes() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = allClasses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold text-[var(--text)]">Fitness Classes</h1>
        <p className="text-[var(--text-muted)] mt-2">Find and reserve your next workout session.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search class by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
        />

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {["All", "Cardio", "Strength", "Flexibility"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === cat
                  ? "bg-[var(--button-bg)] text-[var(--button-text)]"
                  : "bg-[var(--surface-light)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Class List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary)]">
                  {item.category}
                </span>
                <span className="text-[var(--text-muted)]">{item.level}</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text)]">{item.name}</h3>
              <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">{item.duration}</span>
                <Link
                  href={`/Classes/${item.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}