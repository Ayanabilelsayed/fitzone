"use client";

export default function Home() {
  return (
    <section
      className="relative isolate h-screen overflow-hidden text-white"
      style={{
        backgroundImage: "url('/homepage.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden="true" />

      {/* Hero Content */}
      <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 -translate-y-8">
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Transform Your Body,
            <span className="block text-[var(--primary)]">
              Elevate Your Life.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
            Join FITZONE to experience premier fitness facilities, expert
            guidance, dynamic group workouts, and personalized fitness planning
            designed for real results.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("membership")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl bg-[var(--primary)] px-8 py-4 font-bold text-black transition hover:brightness-110"
            >
              Start Free Trial
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("classes")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl border border-white/40 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Explore Classes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
