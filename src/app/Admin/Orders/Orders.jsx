
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  CreditCard,
  CalendarDays,
  UserRound,
  Filter,
  AlertCircle,
  X,
  Package,
  Hash,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import { apiRequest } from "@/lib/api";

const cardClass =
  "rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.07)] dark:border-[#29342c] dark:bg-[#141a17] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]";

const statusStyles = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  paid:
    "bg-lime-100 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]",
  completed:
    "bg-lime-100 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]",
  succeeded:
    "bg-lime-100 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]",
  failed:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  refunded:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAmount = (amount, currency) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "—";

  const currencyCode = (currency || "USD").toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders from backend
  const loadOrders = useCallback(
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

        const data = await apiRequest("/api/admin/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data?.success || !Array.isArray(data.orders)) {
          throw new Error("Invalid orders response from backend.");
        }

        setOrders(data.orders);
      } catch (err) {
        console.error("Orders error:", err);
        setError(err.message || "Could not load orders.");
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
      loadOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadOrders]);

  // Available statuses
  const availableStatuses = useMemo(() => {
    return [
      ...new Set(
        orders
          .map((order) => order.status?.toLowerCase())
          .filter(Boolean)
      ),
    ];
  }, [orders]);

  // Statistics
  const stats = useMemo(() => {
    const normalized = orders.map((order) =>
      String(order.status || "").toLowerCase()
    );

    return [
      {
        title: "Total Orders",
        value: orders.length,
        icon: ShoppingBag,
        color: "text-lime-700 dark:text-[#C8FF3D]",
        bg: "bg-lime-100 dark:bg-[#C8FF3D]/10",
      },
      {
        title: "Pending",
        value: normalized.filter((status) => status === "pending").length,
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-500/10",
      },
      {
        title: "Completed / Paid",
        value: normalized.filter((status) =>
          ["paid", "completed", "succeeded"].includes(status)
        ).length,
        icon: CheckCircle,
        color: "text-lime-700 dark:text-[#C8FF3D]",
        bg: "bg-lime-100 dark:bg-[#C8FF3D]/10",
      },
      {
        title: "Cancelled / Failed",
        value: normalized.filter((status) =>
          ["cancelled", "canceled", "failed"].includes(status)
        ).length,
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-500/10",
      },
    ];
  }, [orders]);

  // Search and filter
  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        String(order.status || "").toLowerCase() === statusFilter;

      const matchesSearch =
        !searchValue ||
        [
          order.id,
          order.user_id,
          order.full_name,
          order.email,
          order.order_type,
          order.status,
          order.items,
          order.stripe_session_id,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(searchValue)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  // Status badge
  const renderStatus = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
          statusStyles[normalizedStatus] ||
          "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        {formatStatus(status)}
      </span>
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
                Orders
              </h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Track membership orders and payment information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadOrders(true)}
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
                Orders Statistics
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Overview of all membership orders.
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
                All Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search and filter membership orders.
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
                  placeholder="Search by member, email, order ID or item..."
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

                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Showing {filteredOrders.length} of {orders.length} orders
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

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#29342c]">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500 dark:bg-[#1d2621] dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Member</th>
                    <th className="px-5 py-4">Order Type</th>
                    <th className="px-5 py-4">Items</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-[#29342c]">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center text-gray-500"
                      >
                        <RefreshCw
                          size={25}
                          className="mx-auto mb-3 animate-spin text-lime-600"
                        />
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center"
                      >
                        <ShoppingBag
                          size={35}
                          className="mx-auto mb-3 text-gray-400"
                        />

                        <p className="font-bold">No orders found</p>

                        <p className="mt-1 text-xs text-gray-500">
                          There are no orders matching your search.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-lime-50/50 dark:hover:bg-[#1d2621]/60"
                      >
                        <td className="px-5 py-4 font-bold text-lime-700 dark:text-[#C8FF3D]">
                          #{order.id}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold">
                            {order.full_name || "Unknown Member"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {order.email || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold">
                            {order.order_type || "—"}
                          </span>
                        </td>

                        <td className="max-w-[200px] px-5 py-4">
                          <p className="truncate" title={order.items || ""}>
                            {order.items || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-bold">
                          {formatAmount(order.amount, order.currency)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-500">
                            {formatDate(order.created_at)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {renderStatus(order.status)}
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            title="View order details"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-lime-500 hover:text-lime-700 dark:border-[#354137] dark:text-gray-300 dark:hover:text-[#C8FF3D]"
                          >
                            <Eye size={16} />
                          </button>
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
            Admin Orders · Track every order with confidence.
          </footer>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-[#354137] dark:bg-[#141a17] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:text-[#C8FF3D]">
                  FITZONE ADMIN
                </p>

                <h2 className="mt-2 text-2xl font-extrabold">
                  Order Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Order #{selectedOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-gray-200 p-2 transition hover:border-red-500 hover:text-red-500 dark:border-[#354137]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              {renderStatus(selectedOrder.status)}
            </div>

            {/* Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Member",
                  value: selectedOrder.full_name,
                  detail: selectedOrder.email,
                  icon: UserRound,
                },
                {
                  label: "Order ID",
                  value: `#${selectedOrder.id}`,
                  detail: `User ID: ${selectedOrder.user_id ?? "—"}`,
                  icon: Hash,
                },
                {
                  label: "Order Type",
                  value: selectedOrder.order_type,
                  detail: "Order category",
                  icon: Package,
                },
                {
                  label: "Amount",
                  value: formatAmount(
                    selectedOrder.amount,
                    selectedOrder.currency
                  ),
                  detail: "Order total",
                  icon: CreditCard,
                },
                {
                  label: "Order Date",
                  value: formatDate(selectedOrder.created_at),
                  detail: "Order creation date",
                  icon: CalendarDays,
                },
                {
                  label: "Status",
                  value: formatStatus(selectedOrder.status),
                  detail: "Current order status",
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

            {/* Items */}
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-[#29342c] dark:bg-[#0b0f0d]">
              <div className="mb-3 flex items-center gap-2 text-lime-700 dark:text-[#C8FF3D]">
                <ShoppingBag size={18} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Order Items
                </span>
              </div>

              <p className="break-words text-sm font-semibold">
                {selectedOrder.items || "No item details available."}
              </p>
            </div>

            {/* Stripe Session */}
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-[#29342c] dark:bg-[#0b0f0d]">
              <div className="mb-3 flex items-center gap-2 text-lime-700 dark:text-[#C8FF3D]">
                <CreditCard size={18} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Stripe Session
                </span>
              </div>

              <p className="break-all text-xs text-gray-500">
                {selectedOrder.stripe_session_id || "Not available"}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-lime-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-lime-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
