"use client";

import Link from "next/link";

const featuredClasses = [
  { id: 1, name: "HIIT & Cardio Flow", category: "Cardio", duration: "45 mins", intensity: "High", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Power Bodybuilding", category: "Strength", duration: "60 mins", intensity: "Extreme", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Vinyasa Power Yoga", category: "Mind & Body", duration: "50 mins", intensity: "Moderate", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600" },
];

const trainers = [
  { id: 1, name: "Marcus Vance", specialty: "Strength & Conditioning", image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Elena Rostova", specialty: "Yoga & Pilates Specialist", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "David Miller", specialty: "CrossFit & Athletic Performance", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary)] border border-[var(--primary)]/20">
              Unleash Your Full Potential
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-[var(--text)] tracking-tight leading-[1.1]">
              Transform Your Body, <span className="text-[var(--primary)]">Elevate Your Life.</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Join Fitzone to experience premier fitness facilities, expert guidance, dynamic group workouts, and personalized fitness planning designed for real results.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/Membership"
                className="px-8 py-4 rounded-xl font-bold bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] shadow-lg transition-all text-center"
              >
                Start Free Trial
              </Link>
              <Link
                href="/Classes"
                className="px-8 py-4 rounded-xl font-bold bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-all text-center"
              >
                Explore Classes
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[var(--primary)] to-emerald-500 opacity-20 blur-2xl -z-10" />
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000"
              alt="Gym Athlete"
              className="w-full h-[480px] object-cover rounded-3xl shadow-2xl border border-[var(--border)]"
            />
          </div>
        </div>
      </section>

      {/* Featured Classes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--text)]">Popular Classes</h2>
            <p className="text-[var(--text-muted)] mt-1">High-energy sessions crafted for every fitness level.</p>
          </div>
          <Link href="/Classes" className="text-sm font-bold text-[var(--primary)] hover:underline">
            View All Classes →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredClasses.map((item) => (
            <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary)]">
                    {item.category}
                  </span>
                  <span className="text-[var(--text-muted)]">{item.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)]">{item.name}</h3>
                <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--text-secondary)]">
                  <span>Intensity: <strong>{item.intensity}</strong></span>
                  <Link href={`/Classes/${item.id}`} className="font-bold text-[var(--primary)] hover:underline">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trainers Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-[var(--text)]">Meet Our Expert Coaches</h2>
          <p className="text-[var(--text-muted)] mt-2">Certified experts committed to helping you achieve your personal goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <article key={trainer.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden text-center p-6 space-y-4">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[var(--primary-soft)]"
              />
              <h3 className="text-xl font-bold text-[var(--text)]">{trainer.name}</h3>
              <p className="text-sm text-[var(--text-muted)]">{trainer.specialty}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}