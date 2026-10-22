"use client";

import Link from "next/link";

const plans = [
  { name: "Basic Plan", price: "$29", period: "/month", features: ["Gym Floor Access", "Locker Room Access", "1 Free Group Class/Month"], popular: false },
  { name: "Pro Plan", price: "$59", period: "/month", features: ["Unlimited Gym Access", "All Group Classes Included", "Free Sauna & Spa", "1 Personal Trainer Session"], popular: true },
  { name: "VIP Elite", price: "$99", period: "/month", features: ["24/7 VIP Gym Access", "Unlimited Classes & Workshops", "4 PT Sessions/Month", "Free Nutrition Consultation"], popular: false },
];

export default function Membership() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[var(--text)]">Membership Plans</h1>
        <p className="text-[var(--text-muted)] mt-2">Choose the plan that fits your fitness goals and budget.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-[var(--card-bg)] border rounded-3xl p-8 flex flex-col justify-between relative ${
              plan.popular ? "border-[var(--primary)] shadow-xl scale-105" : "border-[var(--border)]"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-[var(--button-text)] text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[var(--text)]">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-[var(--text)]">{plan.price}</span>
                <span className="text-sm text-[var(--text-muted)] font-medium">{plan.period}</span>
              </div>
              <ul className="space-y-3 pt-4 border-t border-[var(--border)] text-sm text-[var(--text-secondary)]">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[var(--primary)] font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/Register"
              className={`mt-8 w-full py-3.5 rounded-xl font-bold text-center text-sm transition-all ${
                plan.popular
                  ? "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] shadow-md"
                  : "bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}