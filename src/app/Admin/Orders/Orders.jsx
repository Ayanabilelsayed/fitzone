
"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOrders() {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("fitzoneToken");

      if (!token) {
        throw new Error("Please log in to access payment records.");
      }

      const response = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders.");
      }

      const list = Array.isArray(data)
        ? data
        : data.orders || data.data || [];

      setOrders(list);

      const paid = list.filter((order) => order.status === "paid");
      const pending = list.filter((order) => order.status === "pending");

      setStats({
        totalOrders: list.length,
        paidOrders: paid.length,
        pendingOrders: pending.length,
        revenue: paid.reduce(
          (sum, order) => sum + Number(order.amount || 0),
          0
        ),
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

useEffect(() => {
  const loadOrders = async () => {
    await fetchOrders();
  };

  loadOrders();
}, []);
  const filteredOrders = orders.filter((order) => {
    const text = [
      order.id,
      order.full_name,
      order.user_name,
      order.email,
      order.order_type,
      order.status,
    ]
      .join(" ")
      .toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (filter === "all" || order.status === filter)
    );
  });

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-white",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-[#C8FF3D]",
    },
    {
      title: "Paid Orders",
      value: stats.paidOrders,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-400",
    },
  ];

  function statusStyle(status) {
    if (status === "paid") {
      return "bg-green-500/10 text-green-400";
    }

    if (status === "pending") {
      return "bg-yellow-500/10 text-yellow-400";
    }

    if (status === "cancelled" || status === "failed") {
      return "bg-red-500/10 text-red-400";
    }

    return "bg-gray-500/10 text-gray-300";
  }

  return (
    <div className="min-h-screen bg-[#0b0f0d] text-white">
      <AdminSidebar />

      <main className="min-w-0 p-5 md:p-8 xl:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-[#C8FF3D]">
              FITZONE ADMIN PANEL
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Payments & Orders
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Track membership orders and payment status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#141a17] px-4 py-3 text-sm transition hover:border-[#C8FF3D] disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-[#141a17] p-5 transition hover:border-[#C8FF3D]/40"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <Icon className={card.color} size={22} />
                </div>

                <p className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141a17]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">All Orders</h2>
              <p className="mt-1 text-sm text-gray-400">
                Search and filter payment records.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b0f0d] px-3">
                <Search size={17} className="text-gray-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full bg-transparent py-3 text-sm outline-none sm:w-48"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0b0f0d] px-3 py-3 text-sm outline-none"
              >
                <option value="all">All statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              <XCircle size={20} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">Could not load orders</p>
                <p className="mt-1">{error}</p>
                <p className="mt-2 text-gray-400">
                  Check your login, backend URL, and admin API endpoint.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Loading payment records...
            </div>
          ) : !error && filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard
                size={38}
                className="mx-auto mb-4 text-gray-500"
              />
              <p className="font-medium">No orders found</p>
              <p className="mt-2 text-sm text-gray-400">
                Orders will appear here when available from the backend.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-white/[0.03] text-gray-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">Order ID</th>
                    <th className="px-5 py-4 font-medium">Customer</th>
                    <th className="px-5 py-4 font-medium">Order Type</th>
                    <th className="px-5 py-4 font-medium">Amount</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#C8FF3D]">
                        #{order.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {order.full_name ||
                            order.user_name ||
                            "Customer"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.email || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 capitalize text-gray-300">
                        {String(order.order_type || "membership").replace(
                          "_",
                          " "
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: String(order.currency || "usd").toUpperCase(),
                        }).format(Number(order.amount || 0))}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyle(
                            order.status
                          )}`}
                        >
                          {order.status || "unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
