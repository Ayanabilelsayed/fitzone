
"use client";

import { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TODAY = getToday();

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 25,
    description: "Build your fitness routine",
    features: ["Gym access", "Basic workout guidance", "Locker access"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 45,
    description: "Take your training further",
    features: ["Everything in Basic", "Group classes", "Trainer guidance"],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 70,
    description: "Your complete fitness experience",
    features: [
      "Everything in Pro",
      "Personal training session",
      "Priority class booking",
    ],
  },
];

const trainers = [
  {
    id: 1,
    name: "Marcus Vance",
    specialty: "Head Strength Coach",
    initials: "MV",
    experience: "5+ Years Experience",
  },
  {
    id: 2,
    name: "Elena Rostova",
    specialty: "Yoga & Mindfulness Lead",
    initials: "ER",
    experience: "6+ Years Experience",
  },
  {
    id: 3,
    name: "David Miller",
    specialty: "HIIT & CrossFit Specialist",
    initials: "DM",
    experience: "5+ Years Experience",
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    specialty: "Pilates & Core Instructor",
    initials: "SJ",
    experience: "7+ Years Experience",
  },
];

const workouts = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "CrossFit",
  "Full Body Workout",
];

const times = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

export default function PlanPage() {
  const [darkMode] = useState(true);

  const [planId, setPlanId] = useState("pro");
  const [trainerId, setTrainerId] = useState("");
  const [workout, setWorkout] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const selectedPlan = plans.find((plan) => plan.id === planId);
  const selectedTrainer = trainers.find(
    (trainer) => String(trainer.id) === String(trainerId)
  );

  const pageBackground = darkMode ? "bg-[#0b0f0d]" : "bg-gray-100";
  const mainText = darkMode ? "text-white" : "text-gray-900";
  const cardBackground = darkMode
    ? "border-[#29312b] bg-[#141a17]"
    : "border-gray-200 bg-white";
  const mutedText = darkMode ? "text-gray-400" : "text-gray-500";
  const inputBackground = darkMode
    ? "border-[#29312b] bg-[#0b0f0d] text-white"
    : "border-gray-300 bg-white text-gray-900";

  function resetBooking() {
    setPlanId("pro");
    setTrainerId("");
    setWorkout("");
    setDate("");
    setTime("");
    setPaymentMethod("cash");
    setTermsAccepted(false);
    setError("");
    setSuccess(false);
    setBookingResult(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedPlan) {
      setError("Please select a membership plan.");
      return;
    }

    if (!trainerId || !workout || !date || !time) {
      setError("Please complete all booking fields.");
      return;
    }

    if (date < getToday()) {
      setError("Please select today or a future date.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("fitzoneToken")
        : null;

    if (!token) {
      setError("Please log in before booking your membership.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "stripe") {
        const data = await apiRequest("/api/orders/checkout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId,
            trainerId,
            workout,
            date,
            time,
            termsAccepted,
          }),
        });

        if (!data?.url) {
          throw new Error(
            "Stripe checkout URL was not returned by the backend."
          );
        }

        window.location.assign(data.url);
        return;
      }

      const data = await apiRequest("/api/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId,
          trainerId,
          workout,
          date,
          time,
          paymentMethod: "cash",
          termsAccepted,
        }),
      });

      setBookingResult({
        booking: data.booking,
        subscription: data.subscription,
        plan: selectedPlan,
        trainer: selectedTrainer,
        workout,
        date,
        time,
        paymentMethod: "cash",
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${pageBackground} ${mainText}`}
    >
      <main className="px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 text-center sm:mb-14">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C8FF3D]">
              FITZONE MEMBERSHIP
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Your fitness journey
              <span className="block text-[#C8FF3D]">starts here.</span>
            </h1>

            <p
              className={`mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base ${mutedText}`}
            >
              Choose your membership, meet your trainer, and schedule your
              next workout.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-medium sm:gap-5">
              {[
                "Choose a plan",
                "Book a session",
                "Confirm booking",
              ].map((step, index) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C8FF3D] text-[#0b0f0d]">
                    {index + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>
          </header>

          {success && bookingResult ? (
            <section
              className={`mx-auto max-w-3xl rounded-3xl border p-6 sm:p-10 ${cardBackground}`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C8FF3D] text-3xl font-black text-[#0b0f0d]">
                ✓
              </div>

              <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#C8FF3D]">
                BOOKING REQUEST SUBMITTED
              </p>

              <h2 className="mt-2 text-center text-3xl font-black">
                You&apos;re all set!
              </h2>

              <p className={`mt-3 text-center ${mutedText}`}>
                Your booking request was submitted successfully.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <SummaryCard label="Membership" value={bookingResult.plan.name} />
                <SummaryCard
                  label="Membership price"
                  value={`$${bookingResult.plan.price}`}
                />
                <SummaryCard
                  label="Trainer"
                  value={bookingResult.trainer?.name || "Selected trainer"}
                />
                <SummaryCard label="Workout" value={bookingResult.workout} />
                <SummaryCard label="Date" value={bookingResult.date} />
                <SummaryCard label="Time" value={bookingResult.time} />
                <SummaryCard label="Payment" value="Cash at the gym" />
                <SummaryCard
                  label="Booking status"
                  value={bookingResult.booking?.status || "Pending"}
                />
              </div>

              {bookingResult.booking?.id && (
                <div className="mt-5 rounded-xl border border-[#29312b] bg-[#0b0f0d] p-4">
                  <p className={`text-xs ${mutedText}`}>Booking reference</p>
                  <p className="mt-1 break-all font-bold text-[#C8FF3D]">
                    {bookingResult.booking.id}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetBooking}
                  className="flex-1 rounded-xl bg-[#C8FF3D] px-6 py-3.5 font-bold text-[#0b0f0d] transition hover:bg-[#b6ed2e]"
                >
                  Make Another Booking
                </button>

                <Link
                  href="/"
                  className="flex-1 rounded-xl border border-[#46513e] px-6 py-3.5 text-center font-bold transition hover:border-[#C8FF3D]"
                >
                  Back to Home
                </Link>
              </div>
            </section>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
                <div className="space-y-8">
                  <section>
                    <SectionHeading
                      number="01"
                      title="Choose your plan"
                      subtitle="Select the membership that fits your goals."
                    />

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      {plans.map((plan) => {
                        const isSelected = planId === plan.id;

                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setPlanId(plan.id)}
                            aria-pressed={isSelected}
                            className={`relative flex h-full flex-col rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 ${
                              isSelected
                                ? "border-[#C8FF3D] bg-[#1b2518] shadow-[0_0_0_1px_#C8FF3D]"
                                : cardBackground
                            }`}
                          >
                            {plan.popular && (
                              <span className="mb-3 self-start rounded-full bg-[#C8FF3D] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0b0f0d]">
                                Most popular
                              </span>
                            )}

                            <div className="flex w-full items-start justify-between gap-2">
                              <h3 className="text-xl font-black">{plan.name}</h3>
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                                  isSelected
                                    ? "border-[#C8FF3D] bg-[#C8FF3D] text-[#0b0f0d]"
                                    : "border-gray-500"
                                }`}
                              >
                                {isSelected ? "✓" : ""}
                              </span>
                            </div>

                            <p className={`mt-2 text-xs leading-5 ${mutedText}`}>
                              {plan.description}
                            </p>

                            <p className="mt-5 text-3xl font-black">
                              ${plan.price}
                              <span className={`ml-1 text-xs font-normal ${mutedText}`}>
                                / month
                              </span>
                            </p>

                            <div className="my-5 h-px w-full bg-[#46513e]" />

                            <ul className="space-y-3">
                              {plan.features.map((feature) => (
                                <li
                                  key={feature}
                                  className={`flex gap-2 text-xs leading-5 ${mutedText}`}
                                >
                                  <span className="font-bold text-[#C8FF3D]">✓</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className={`rounded-2xl border p-5 sm:p-7 ${cardBackground}`}>
                    <SectionHeading
                      number="02"
                      title="Choose your trainer"
                      subtitle="Pick the trainer you want to work with."
                    />

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {trainers.map((trainer) => {
                        const isSelected = String(trainer.id) === String(trainerId);

                        return (
                          <button
                            key={trainer.id}
                            type="button"
                            onClick={() => setTrainerId(String(trainer.id))}
                            aria-pressed={isSelected}
                            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                              isSelected
                                ? "border-[#C8FF3D] bg-[#1b2518]"
                                : "border-[#29312b] bg-[#0b0f0d] hover:border-[#64715a]"
                            }`}
                          >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C8FF3D] text-sm font-black text-[#0b0f0d]">
                              {trainer.initials}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block font-bold">{trainer.name}</span>
                              <span className={`mt-1 block text-xs ${mutedText}`}>
                                {trainer.specialty}
                              </span>
                            </span>

                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                                isSelected
                                  ? "border-[#C8FF3D] bg-[#C8FF3D] text-[#0b0f0d]"
                                  : "border-gray-500"
                              }`}
                            >
                              {isSelected ? "✓" : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className={`rounded-2xl border p-5 sm:p-7 ${cardBackground}`}>
                    <SectionHeading
                      number="03"
                      title="Schedule your workout"
                      subtitle="Choose your workout type, date and time."
                    />

                    <div className="mt-6">
                      <label htmlFor="workout" className="mb-2 block text-sm font-semibold">
                        Workout type
                      </label>
                      <select
                        id="workout"
                        value={workout}
                        onChange={(event) => setWorkout(event.target.value)}
                        required
                        className={`w-full rounded-xl border px-4 py-3.5 outline-none focus:border-[#C8FF3D] ${inputBackground}`}
                      >
                        <option value="">Select a workout</option>
                        {workouts.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="booking-date" className="mb-2 block text-sm font-semibold">
                          Booking date
                        </label>
                        <input
                          id="booking-date"
                          type="date"
                          min={TODAY}
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                          required
                          className={`w-full rounded-xl border px-4 py-3.5 outline-none focus:border-[#C8FF3D] ${inputBackground}`}
                        />
                      </div>

                      <div>
                        <label htmlFor="booking-time" className="mb-2 block text-sm font-semibold">
                          Booking time
                        </label>
                        <select
                          id="booking-time"
                          value={time}
                          onChange={(event) => setTime(event.target.value)}
                          required
                          className={`w-full rounded-xl border px-4 py-3.5 outline-none focus:border-[#C8FF3D] ${inputBackground}`}
                        >
                          <option value="">Select a time</option>
                          {times.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className={`rounded-2xl border p-5 sm:p-7 ${cardBackground}`}>
                    <SectionHeading
                      number="04"
                      title="Payment & confirmation"
                      subtitle="Choose how you want to pay and accept the terms."
                    />

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        aria-pressed={paymentMethod === "cash"}
                        className={`rounded-xl border p-4 text-left transition ${
                          paymentMethod === "cash"
                            ? "border-[#C8FF3D] bg-[#1b2518]"
                            : "border-[#29312b] bg-[#0b0f0d]"
                        }`}
                      >
                        <span className="block font-bold">Cash at the gym</span>
                        <span className={`mt-2 block text-xs ${mutedText}`}>
                          Pay in person at the gym.
                        </span>
                        <span className="mt-3 block text-xs font-bold text-[#C8FF3D]">
                          {paymentMethod === "cash" ? "✓ Selected" : "Select"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("stripe")}
                        aria-pressed={paymentMethod === "stripe"}
                        className={`rounded-xl border p-4 text-left transition ${
                          paymentMethod === "stripe"
                            ? "border-[#C8FF3D] bg-[#1b2518]"
                            : "border-[#29312b] bg-[#0b0f0d]"
                        }`}
                      >
                        <span className="block font-bold">Pay online with Stripe</span>
                        <span className={`mt-2 block text-xs ${mutedText}`}>
                          Secure checkout in test mode.
                        </span>
                        <span className="mt-3 block text-xs font-bold text-[#C8FF3D]">
                          {paymentMethod === "stripe" ? "✓ Selected" : "Select"}
                        </span>
                      </button>
                    </div>

                    <label className="mt-6 flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(event) => setTermsAccepted(event.target.checked)}
                        required
                        className="mt-1 h-4 w-4 shrink-0 accent-[#C8FF3D]"
                      />
                      <span className={`text-sm leading-6 ${mutedText}`}>
                        I agree to the booking terms and conditions and confirm
                        that the information I provided is correct.
                      </span>
                    </label>
                  </section>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm leading-6 text-red-400"
                    >
                      <span className="font-bold">Booking error: </span>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#C8FF3D] px-6 py-4 font-black text-[#0b0f0d] transition hover:bg-[#b6ed2e] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? paymentMethod === "stripe"
                        ? "Opening Stripe checkout..."
                        : "Processing your booking..."
                      : paymentMethod === "stripe"
                        ? "Continue to Secure Payment"
                        : "Confirm Booking"}
                    {!loading && <span aria-hidden="true">→</span>}
                  </button>
                </div>

                <aside className="lg:sticky lg:top-6">
                  <div className={`overflow-hidden rounded-2xl border ${cardBackground}`}>
                    <div className="bg-[#C8FF3D] p-6 text-[#0b0f0d]">
                      <p className="text-xs font-black uppercase tracking-[0.2em]">
                        YOUR BOOKING
                      </p>
                      <h2 className="mt-2 text-2xl font-black">Order summary</h2>
                      <p className="mt-2 text-sm text-[#26351b]">
                        Check your choices before confirming.
                      </p>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                      <SummaryRow label="Membership" value={selectedPlan?.name || "Not selected"} />
                      <SummaryRow label="Trainer" value={selectedTrainer?.name || "Not selected"} />
                      <SummaryRow label="Workout" value={workout || "Not selected"} />
                      <SummaryRow label="Date" value={date || "Not selected"} />
                      <SummaryRow label="Time" value={time || "Not selected"} />
                      <SummaryRow
                        label="Payment"
                        value={paymentMethod === "stripe" ? "Stripe online" : "Cash at the gym"}
                      />

                      <div className="border-t border-[#46513e] pt-5">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className={`text-xs ${mutedText}`}>Monthly membership</p>
                            <p className="mt-1 text-3xl font-black text-[#C8FF3D]">
                              ${selectedPlan?.price ?? 0}
                            </p>
                          </div>
                          <span className={`pb-1 text-xs ${mutedText}`}>/ month</span>
                        </div>

                        <p className={`mt-3 text-xs leading-5 ${mutedText}`}>
                          {paymentMethod === "stripe"
                            ? "You will be redirected to Stripe to complete your test payment."
                            : "Payment is made at the gym. Submitting this request does not mean payment has been completed."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 rounded-2xl border p-5 ${cardBackground}`}>
                    <p className="font-bold">Need help?</p>
                    <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                      Make sure your booking details are correct before submitting.
                    </p>
                  </div>
                </aside>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function SectionHeading({ number, title, subtitle }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C8FF3D] text-sm font-black text-[#0b0f0d]">
        {number}
      </span>
      <div>
        <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="max-w-[60%] break-words text-right text-sm font-semibold">
        {value}
      </span>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#29312b] bg-[#0b0f0d] p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-2 break-words font-bold text-[#C8FF3D]">{value}</p>
    </div>
  );
}
