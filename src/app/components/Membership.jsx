
"use client";

import Link from "next/link";

const plans = [
  {
    name: "Basic Plan",
    price: 29,
    period: "/month",
    features: [
      "Gym Floor Access",
      "Locker Room Access",
      "1 Free Group Class/Month",
    ],
    popular: false,
  },
  {
    name: "Pro Plan",
    price: 59,
    period: "/month",
    features: [
      "Unlimited Gym Access",
      "All Group Classes Included",
      "Free Sauna & Spa",
      "1 Personal Trainer Session",
    ],
    popular: true,
  },
  {
    name: "VIP Elite",
    price: 99,
    period: "/month",
    features: [
      "24/7 VIP Gym Access",
      "Unlimited Classes & Workshops",
      "4 PT Sessions/Month",
      "Free Nutrition Consultation",
    ],
    popular: false,
  },
];

export default function Membership() {
  return (
    <section
      id="membership"
      className="w-full bg-[var(--background)] py-16 text-[var(--text)] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Find Your Fit
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Membership Plans
          </h1>

          <p className="mt-3 leading-7 text-[var(--text-secondary)]">
            Choose the plan that fits your fitness goals and budget.
          </p>
        </div>

        {/* Membership Cards */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-8 ${
                plan.popular
                  ? "border-[var(--primary)] shadow-lg md:scale-105"
                  : "border-[var(--border)]"
              } bg-[var(--card-bg)]`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--button-text)]">
                  Most Popular
                </span>
              )}

              <div>
                <h2 className="text-xl font-bold">{plan.name}</h2>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-black">${plan.price}</span>
                  <span className="text-sm font-medium text-[var(--text-muted)]">
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-7 space-y-4 border-t border-[var(--border)] pt-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-[var(--text-secondary)]"
                    >
                      <span className="font-bold text-[var(--primary)]">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/Payment?plan=${encodeURIComponent(plan.name)}`}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                  plan.popular
                    ? "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--primary-hover)]"
                    : "border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                Get Started
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>

        <p className="text-center text-xs leading-5 text-[var(--text-muted)]">
          All membership plans are billed monthly. Choose your plan to continue.
        </p>
      </div>
    </section>
  );
}
