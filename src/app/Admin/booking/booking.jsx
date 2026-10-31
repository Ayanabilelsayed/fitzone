
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CalendarCheck,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  Dumbbell,
  UserRound,
  CreditCard,
  CalendarDays,
  X,
  Filter,
  AlertCircle,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import { apiRequest } from "@/lib/api";

const cardClass =
  "rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.07)] dark:border-[#29342c] dark:bg-[#141a17] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]";

const statusStyles = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  confirmed:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  completed:
    "bg-lime-100 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]",
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) =>
  status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

export default function BookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Load bookings
  const loadBookings = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const savedUser = sessionStorage.getItem("fitzoneUser");
        const token = sessionStorage.getItem("fitzoneToken");

        if (!savedUser || !token) {
          router.replace("/login");
          return;
        }

        let user;

        try {
          user = JSON.parse(savedUser);
        } catch {
          sessionStorage.removeItem("fitzoneUser");
          sessionStorage.removeItem("fitzoneToken");
          router.replace("/login");
          return;
        }

        if (user?.role?.toLowerCase() !== "admin") {
          router.replace("/project");
          return;
        }

        const data = await apiRequest("/api/admin/bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data?.success || !Array.isArray(data.bookings)) {
          throw new Error("Invalid bookings response from backend.");
        }

        setBookings(data.bookings);
      } catch (err) {
        console.error("Bookings error:", err);
        setError(err.message || "Could not load bookings.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadBookings]);

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    const token = sessionStorage.getItem("fitzoneToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to mark this booking as ${newStatus}?`
    );

    if (!confirmed) return;

    setUpdatingId(bookingId);
    setError("");

    try {
      await apiRequest(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      await loadBookings(true);

      setSelectedBooking((current) =>
        current && Number(current.id) === Number(bookingId)
          ? { ...current, status: newStatus }
          : current
      );
    } catch (err) {
      console.error("Update booking error:", err);
      setError(err.message || "Could not update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Statistics
  const stats = useMemo(
    () => [
      {
        title: "Total Bookings",
        value: bookings.length,
        icon: CalendarCheck,
        color: "text-lime-700 dark:text-[#C8FF3D]",
        bg: "bg-lime-100 dark:bg-[#C8FF3D]/10",
      },
      {
        title: "Pending",
        value: bookings.filter((b) => b.status === "pending").length,
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-500/10",
      },
      {
        title: "Confirmed",
        value: bookings.filter((b) => b.status === "confirmed").length,
        icon: CheckCircle,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-500/10",
      },
      {
        title: "Cancelled",
        value: bookings.filter((b) => b.status === "cancelled").length,
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-500/10",
      },
    ],
    [bookings]
  );

  // Search and filter
  const filteredBookings = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      const matchesSearch =
        !searchValue ||
        [
          booking.id,
          booking.full_name,
          booking.email,
          booking.plan_name,
          booking.trainer_name,
          booking.workout,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(searchValue)
        );

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  // Status badge
  const renderStatus = (status) => (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        statusStyles[status] ||
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {formatStatus(status)}
    </span>
  );

  // Booking actions
  const renderActions = (booking) => {
    const isUpdating = updatingId === booking.id;

    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedBooking(booking)}
          title="View booking details"
          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-lime-500 hover:text-lime-700 dark:border-[#354137] dark:text-gray-300 dark:hover:text-[#C8FF3D]"
        >
          <Eye size={16} />
        </button>

        {booking.status === "pending" && (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateBookingStatus(booking.id, "confirmed")
              }
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? "..." : "Confirm"}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateBookingStatus(booking.id, "cancelled")
              }
              className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}

        {booking.status === "confirmed" && (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateBookingStatus(booking.id, "completed")
              }
              className="rounded-lg bg-lime-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-lime-700 disabled:opacity-50"
            >
              {isUpdating ? "..." : "Complete"}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateBookingStatus(booking.id, "cancelled")
              }
              className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0f0d] dark:text-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8 rounded-3xl border border-gray-200/70 bg-gradient-to-br from-white via-gray-50 to-lime-50/40 p-4 shadow-xl dark:border-[#29342c] dark:bg-none dark:bg-[#101612] sm:p-6 lg:p-8">

          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/70 bg-white/80 p-5 dark:border-[#29342c] dark:bg-[#141a17]/80">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:text-[#C8FF3D]">
                FITZONE ADMIN
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Bookings
              </h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Manage workout bookings and member appointments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadBookings(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:border-lime-500 disabled:opacity-50 dark:border-[#29342c]"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </header>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Something went wrong</p>
                <p className="mt-1 break-words">{error}</p>
              </div>
            </div>
          )}

          {/* Statistics */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-extrabold">
                Booking Statistics
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Overview of all member bookings.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className={`${cardClass} relative overflow-hidden p-5`}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-lime-100/50 dark:bg-[#C8FF3D]/[0.04]" />

                    <div className="relative flex items-center justify-between">
                      <div
                        className={`${stat.bg} ${stat.color} rounded-2xl p-3.5`}
                      >
                        <Icon size={24} strokeWidth={2.2} />
                      </div>
                    </div>

                    <p className="relative mt-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>

                    <h3 className="relative mt-2 text-3xl font-extrabold">
                      {loading ? "..." : stat.value}
                    </h3>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Search and Filter */}
          <section className={`${cardClass} space-y-5 p-5`}>
            <div>
              <h2 className="text-xl font-extrabold">
                All Bookings
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search, filter and manage member appointments.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by member, email, trainer or workout..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-lime-500 dark:border-[#354137] dark:bg-[#0b0f0d]"
                />
              </div>

              <div className="relative lg:w-56">
                <Filter
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-lime-500 dark:border-[#354137] dark:bg-[#0b0f0d]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>

              {(search || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="font-bold text-lime-700 hover:underline dark:text-[#C8FF3D]"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#29342c]">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500 dark:bg-[#1d2621] dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Booking</th>
                    <th className="px-5 py-4">Member</th>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Trainer & Workout</th>
                    <th className="px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-[#29342c]">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center text-gray-500"
                      >
                        <RefreshCw
                          size={25}
                          className="mx-auto mb-3 animate-spin text-lime-600"
                        />
                        Loading bookings...
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >
                        <CalendarCheck
                          size={35}
                          className="mx-auto mb-3 text-gray-400"
                        />
                        <p className="font-bold">No bookings found</p>
                        <p className="mt-1 text-xs text-gray-500">
                          There are no bookings matching your search.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-lime-50/50 dark:hover:bg-[#1d2621]/60"
                      >
                        <td className="px-5 py-4 font-bold text-lime-700 dark:text-[#C8FF3D]">
                          #{booking.id}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold">
                            {booking.full_name || "Unknown Member"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {booking.email || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {booking.plan_name || "—"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            ${Number(booking.price || 0).toFixed(2)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {booking.trainer_name || "—"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {booking.workout || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {formatDate(booking.booking_date)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {booking.booking_time || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {renderStatus(booking.status)}
                        </td>

                        <td className="px-5 py-4">
                          {renderActions(booking)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer */}
          <footer className="rounded-xl border border-gray-200/70 bg-white/70 px-4 py-4 text-center text-xs text-gray-400 dark:border-[#29342c] dark:bg-[#141a17]/70">
            <span className="font-bold text-lime-700 dark:text-[#C8FF3D]">
              FITZONE
            </span>{" "}
            Admin Bookings · Manage smarter, train stronger.
          </footer>
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-[#354137] dark:bg-[#141a17] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:text-[#C8FF3D]">
                  FITZONE ADMIN
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Booking Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Booking #{selectedBooking.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl border border-gray-200 p-2 transition hover:border-red-500 hover:text-red-500 dark:border-[#354137]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              {renderStatus(selectedBooking.status)}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Member",
                  value: selectedBooking.full_name,
                  detail: selectedBooking.email,
                  icon: Users,
                },
                {
                  label: "Membership Plan",
                  value: selectedBooking.plan_name,
                  detail: `$${Number(selectedBooking.price || 0).toFixed(2)}`,
                  icon: CreditCard,
                },
                {
                  label: "Trainer",
                  value: selectedBooking.trainer_name,
                  detail: `Trainer ID: ${selectedBooking.trainer_id ?? "—"}`,
                  icon: UserRound,
                },
                {
                  label: "Workout",
                  value: selectedBooking.workout,
                  detail: "Selected workout",
                  icon: Dumbbell,
                },
                {
                  label: "Booking Date",
                  value: formatDate(selectedBooking.booking_date),
                  detail: "Scheduled date",
                  icon: CalendarDays,
                },
                {
                  label: "Booking Time",
                  value: selectedBooking.booking_time,
                  detail: "Scheduled time",
                  icon: Clock,
                },
                {
                  label: "Payment Method",
                  value: selectedBooking.payment_method,
                  detail: "Subscription payment",
                  icon: CreditCard,
                },
                {
                  label: "Terms Accepted",
                  value: selectedBooking.terms_accepted ? "Yes" : "No",
                  detail: "Booking terms",
                  icon: CheckCircle,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-[#29342c] dark:bg-[#0b0f0d]"
                  >
                    <div className="mb-3 flex items-center gap-2 text-lime-700 dark:text-[#C8FF3D]">
                      <Icon size={18} />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>

                    <p className="break-words font-bold">
                      {item.value || "—"}
                    </p>

                    <p className="mt-1 break-words text-xs text-gray-500">
                      {item.detail || ""}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    type="button"
                    disabled={updatingId === selectedBooking.id}
                    onClick={() =>
                      updateBookingStatus(
                        selectedBooking.id,
                        "confirmed"
                      )
                    }
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === selectedBooking.id}
                    onClick={() =>
                      updateBookingStatus(
                        selectedBooking.id,
                        "cancelled"
                      )
                    }
                    className="rounded-xl bg-red-100 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 disabled:opacity-50"
                  >
                    Cancel Booking
                  </button>
                </>
              )}

              {selectedBooking.status === "confirmed" && (
                <>
                  <button
                    type="button"
                    disabled={updatingId === selectedBooking.id}
                    onClick={() =>
                      updateBookingStatus(
                        selectedBooking.id,
                        "completed"
                      )
                    }
                    className="rounded-xl bg-lime-600 px-5 py-3 text-sm font-bold text-white hover:bg-lime-700 disabled:opacity-50"
                  >
                    Mark as Completed
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === selectedBooking.id}
                    onClick={() =>
                      updateBookingStatus(
                        selectedBooking.id,
                        "cancelled"
                      )
                    }
                    className="rounded-xl bg-red-100 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 disabled:opacity-50"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
