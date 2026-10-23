"use client";

import { useState } from "react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 25,
    description: "Perfect for getting started",
    features: ["Full gym access", "Gym equipment", "Locker room"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 45,
    description: "For your fitness goals",
    features: ["Full gym access", "Group classes", "Progress tracking"],
  },
  {
    id: "elite",
    name: "Elite",
    price: 70,
    description: "Your premium fitness experience",
    features: ["All Pro features", "Personal training", "Priority booking"],
  },
];

const trainers = [
  { id: "ahmed", name: "Ahmed Hassan", specialty: "Strength Training" },
  { id: "sara", name: "Sara Mohamed", specialty: "Yoga & Flexibility" },
  { id: "omar", name: "Omar Ali", specialty: "HIIT & Cardio" },
  { id: "nour", name: "Nour Ibrahim", specialty: "Fitness & Conditioning" },
];

const workouts = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "CrossFit",
  "Full Body Workout",
];

const timeSlots = [
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

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function PlanPage() {
  const [planId, setPlanId] = useState("pro");
  const [trainerId, setTrainerId] = useState("");
  const [workout, setWorkout] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedPlan = plans.find((plan) => plan.id === planId);
  const selectedTrainer = trainers.find(
    (trainer) => trainer.id === trainerId
  );

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedPlan || !selectedTrainer || !workout || !date || !time) {
      setError("Please complete all your booking details.");
      return;
    }

    if (date < getToday()) {
      setError("Please choose today or a future date.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      return;
    }

    // Frontend demo only. Connect this step to the backend
    // before treating the subscription as a real booking.
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetBooking() {
    setSuccess(false);
    setError("");
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f0d] px-4 py-12 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-[#29322c] bg-[#141a17] p-6 text-center sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8FF3D] bg-[#C8FF3D]/10 text-4xl text-[#C8FF3D]">
            ✓
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-[#C8FF3D]">
            FITZONE
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Booking Successful!
          </h1>

          <p className="mx-auto mt-4 max-w-md leading-7 text-gray-400">
            Thank you for choosing FITZONE! Your booking details
            are ready. Connect your account to save and confirm
            your reservation.
          </p>

          <div className="mt-8 rounded-2xl border border-[#29322c] bg-[#0b0f0d] p-5 text-left">
            <h2 className="mb-5 text-lg font-bold">
              Your Booking Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Membership</span>
                <span className="font-semibold">{selectedPlan.name}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Duration</span>
                <span>1 Month</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Total</span>
                <span className="font-bold text-[#C8FF3D]">
                  ${selectedPlan.price}
                </span>
              </div>

              <div className="h-px bg-[#29322c]" />

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Trainer</span>
                <span className="text-right">{selectedTrainer.name}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Workout</span>
                <span className="text-right">{workout}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Date</span>
                <span>{date}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Time</span>
                <span>{time}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Payment</span>
                <span>
                  {paymentMethod === "cash" ? "Cash at Gym" : "Online"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 w-full rounded-xl bg-[#C8FF3D] px-6 py-4 font-bold text-[#0b0f0d] transition hover:bg-[#b5ed30]"
          >
            Back to Home
          </button>

          <button
            onClick={resetBooking}
            className="mt-3 w-full rounded-xl border border-[#37413b] px-6 py-3 font-semibold text-gray-300 transition hover:border-[#C8FF3D] hover:text-[#C8FF3D]"
          >
            Edit Booking
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f0d] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C8FF3D]">
            FITZONE MEMBERSHIP
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
            Build Your Fitness Plan
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
            Choose your membership, meet your favorite trainer,
            select your workout, and book your preferred time.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Choose a membership */}
          <section className="rounded-2xl border border-[#29322c] bg-[#141a17] p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF3D] font-bold text-black">
                01
              </span>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Choose Your Plan
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Select the membership that fits your goals.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => {
                const isSelected = planId === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    aria-pressed={isSelected}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? "border-[#C8FF3D] bg-[#C8FF3D]/5"
                        : "border-[#37413b] hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold">{plan.name}</h3>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                          isSelected
                            ? "border-[#C8FF3D] bg-[#C8FF3D] text-black"
                            : "border-gray-500"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-400">
                      {plan.description}
                    </p>

                    <p className="mt-5 text-3xl font-bold text-[#C8FF3D]">
                      ${plan.price}
                      <span className="text-sm font-normal text-gray-400">
                        {" "}/ month
                      </span>
                    </p>

                    <ul className="mt-5 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-2 text-sm text-gray-300"
                        >
                          <span className="text-[#C8FF3D]">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 2: Choose a trainer */}
          <section className="rounded-2xl border border-[#29322c] bg-[#141a17] p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF3D] font-bold text-black">
                02
              </span>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Choose Your Trainer
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Pick your preferred fitness coach.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {trainers.map((trainer) => {
                const isSelected = trainerId === trainer.id;

                return (
                  <button
                    key={trainer.id}
                    type="button"
                    onClick={() => setTrainerId(trainer.id)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#C8FF3D] bg-[#C8FF3D]/5"
                        : "border-[#37413b] hover:border-gray-500"
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#263029] text-xl font-bold text-[#C8FF3D]">
                      {trainer.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{trainer.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {trainer.specialty}
                      </p>
                    </div>

                    <span className="text-[#C8FF3D]">
                      {isSelected ? "✓" : "○"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Choose a workout */}
          <section className="rounded-2xl border border-[#29322c] bg-[#141a17] p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF3D] font-bold text-black">
                03
              </span>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Select Your Workout
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  What would you like to train?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {workouts.map((item) => {
                const isSelected = workout === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setWorkout(item)}
                    aria-pressed={isSelected}
                    className={`rounded-xl border p-4 text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#C8FF3D] bg-[#C8FF3D] text-black"
                        : "border-[#37413b] text-gray-300 hover:border-[#C8FF3D]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 4: Choose a date and time */}
          <section className="rounded-2xl border border-[#29322c] bg-[#141a17] p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF3D] font-bold text-black">
                04
              </span>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Book Your Session
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Select your preferred date and time.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="booking-date"
                  className="mb-2 block text-sm font-semibold"
                >
                  Booking Date
                </label>

                <input
                  id="booking-date"
                  type="date"
                  min={getToday()}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#37413b] bg-[#0b0f0d] px-4 py-4 text-white outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-time"
                  className="mb-2 block text-sm font-semibold"
                >
                  Available Time
                </label>

                <select
                  id="booking-time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#37413b] bg-[#0b0f0d] px-4 py-4 text-white outline-none focus:border-[#C8FF3D]"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              These are sample time slots. Real availability and
              trainer schedules must be checked by the backend.
            </p>
          </section>

          {/* Step 5: Payment method */}
          <section className="rounded-2xl border border-[#29322c] bg-[#141a17] p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF3D] font-bold text-black">
                05
              </span>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Payment Method
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Choose how you intend to pay.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                aria-pressed={paymentMethod === "cash"}
                className={`rounded-xl border p-5 text-left transition ${
                  paymentMethod === "cash"
                    ? "border-[#C8FF3D] bg-[#C8FF3D]/5"
                    : "border-[#37413b]"
                }`}
              >
                <span className="text-lg">💵</span>
                <h3 className="mt-3 font-bold">Cash at Gym</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Pay at the gym reception.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                aria-pressed={paymentMethod === "online"}
                className={`rounded-xl border p-5 text-left transition ${
                  paymentMethod === "online"
                    ? "border-[#C8FF3D] bg-[#C8FF3D]/5"
                    : "border-[#37413b]"
                }`}
              >
                <span className="text-lg">💳</span>
                <h3 className="mt-3 font-bold">Online Payment</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Online payment integration required.
                </p>
              </button>
            </div>
          </section>

          {/* Booking summary */}
          <section className="rounded-2xl border border-[#C8FF3D]/40 bg-[#141a17] p-5 sm:p-8">
            <h2 className="text-2xl font-bold">Booking Summary</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Membership</span>
                <span className="font-semibold">{selectedPlan.name}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Duration</span>
                <span>1 Month</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Trainer</span>
                <span className="text-right">
                  {selectedTrainer?.name || "Not selected"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Workout</span>
                <span className="text-right">{workout || "Not selected"}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Date & Time</span>
                <span className="text-right">
                  {date || "Not selected"}
                  {time ? ` • ${time}` : ""}
                </span>
              </div>

              <div className="my-4 h-px bg-[#37413b]" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold text-[#C8FF3D]">
                  ${selectedPlan.price}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Sample prices in USD. Final pricing and payment
                are subject to backend and payment integration.
              </p>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-300">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) =>
                  setTermsAccepted(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#C8FF3D]"
              />

              <span>
                I agree to the terms and conditions and confirm
                my selected membership and booking details.
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-[#C8FF3D] px-6 py-4 font-bold text-[#0b0f0d] transition hover:bg-[#b5ed30] focus:outline-none focus:ring-2 focus:ring-[#C8FF3D] focus:ring-offset-2 focus:ring-offset-[#141a17]"
            >
              Confirm Booking →
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Demo only: this button currently shows a success
              screen without saving a real subscription or booking.
            </p>
          </section>
        </form>
      </div>
    </main>
  );
}