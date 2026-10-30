
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Users,
  Dumbbell,
  CalendarCheck,
  ShoppingBag,
  UserRound,
  ArrowUpRight,
  Activity,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

const DashboardCharts = dynamic(() => import("../components/DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-[#141a17]" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-[#141a17]" />
        <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-[#141a17]" />
      </div>
    </div>
  ),
});

const initialStats = [
  {
    title: "Total Members",
    value: "—",
    icon: Users,
    color: "text-lime-700 dark:text-[#C8FF3D]",
    bg: "bg-lime-100 dark:bg-[#C8FF3D]/10",
    path: "/Admin/Members",
  },
  {
    title: "Total Classes",
    value: "—",
    icon: Dumbbell,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-500/10",
    path: "/Admin/classes",
  },
  {
    title: "Total Trainers",
    value: "—",
    icon: UserRound,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    path: "/Admin/trainers",
  },
  {
    title: "Total Orders",
    value: "—",
    icon: ShoppingBag,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-400/10",
    path: "/Admin/Orders",
  },
];

const cardClass =
  "rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.07)] transition-all duration-300 dark:border-[#29342c] dark:bg-[#141a17] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]";

const normalizeRows = (rows) =>
  Array.isArray(rows)
    ? rows.map((row) => ({
        label: row.label ?? row.month ?? row.date ?? "",
        members: Number(
          row.members ?? row.total_members ?? row.totalMembers ?? 0
        ),
      }))
    : [];

export default function OverviewPage() {
  const router = useRouter();

  const [memberChart, setMemberChart] = useState({
    "7 days": [],
    "30 days": [],
    "12 months": [],
  });

  const [period, setPeriod] = useState("12 months");
  const [bookingChartData, setBookingChartData] = useState([]);
  const [classChartData, setClassChartData] = useState([]);

  const [dashboardCounts, setDashboardCounts] = useState({
    totalMembers: "—",
    totalClasses: "—",
    totalTrainers: "—",
    totalOrders: "—",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const savedUser = sessionStorage.getItem("fitzoneUser");
        const token = sessionStorage.getItem("fitzoneToken");

        if (!savedUser || !token) {
          router.push("/login");
          return;
        }

        let user;

        try {
          user = JSON.parse(savedUser);
        } catch {
          sessionStorage.removeItem("fitzoneUser");
          sessionStorage.removeItem("fitzoneToken");
          router.push("/login");
          return;
        }

        if (user.role !== "admin") {
          router.push("/project");
          return;
        }

        const apiBase = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        ).replace(/\/$/, "");

        const response = await fetch(`${apiBase}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (response.status === 401) {
          sessionStorage.removeItem("fitzoneToken");
          sessionStorage.removeItem("fitzoneUser");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.message || `Dashboard request failed (${response.status}).`
          );
        }

        if (!data?.success || !data.stats) {
          throw new Error("Invalid dashboard response from backend.");
        }

        if (cancelled) return;

        const apiStats = data.stats;
        const growth = apiStats.memberGrowth || {};

        setDashboardCounts({
          totalMembers: Number(apiStats.totalMembers ?? 0),
          totalClasses: Number(apiStats.totalClasses ?? 0),
          totalTrainers: Number(apiStats.totalTrainers ?? 0),
          totalOrders: Number(apiStats.totalOrders ?? 0),
        });

        setMemberChart({
          "7 days": normalizeRows(growth["7 days"]),
          "30 days": normalizeRows(growth["30 days"]),
          "12 months": normalizeRows(growth["12 months"]),
        });

        setBookingChartData(
          Array.isArray(apiStats.bookingsByWorkout)
            ? apiStats.bookingsByWorkout.map((row) => ({
                name: row.name ?? row.workout ?? "Other",
                bookings: Number(row.bookings ?? row.count ?? row.total ?? 0),
              }))
            : []
        );

        setClassChartData(
          Array.isArray(apiStats.classDistribution)
            ? apiStats.classDistribution.map((row) => ({
                name: row.name ?? row.category ?? "Other",
                value: Number(row.value ?? row.count ?? row.total ?? 0),
              }))
            : []
        );
      } catch (err) {
        console.error("Dashboard error:", err);

        if (!cancelled) {
          setError(err.message || "Could not connect to the backend.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const stats = initialStats.map((item) => ({
    ...item,
    value: loading
      ? "..."
      : item.title === "Total Members"
        ? dashboardCounts.totalMembers
        : item.title === "Total Classes"
          ? dashboardCounts.totalClasses
          : item.title === "Total Trainers"
            ? dashboardCounts.totalTrainers
            : dashboardCounts.totalOrders,
  }));

  const chartTooltipStyle = {
    backgroundColor: "#141a17",
    border: "1px solid #29342c",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0f0d] dark:text-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8 rounded-3xl border border-gray-200/70 bg-gradient-to-br from-white via-gray-50 to-lime-50/40 p-4 shadow-xl dark:border-[#29342c] dark:bg-none dark:bg-[#101612] sm:p-6 lg:p-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/70 bg-white/80 p-5 dark:border-[#29342c] dark:bg-[#141a17]/80">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:text-[#C8FF3D]">
                FITZONE ADMIN
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Manage your gym and monitor its performance.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm hover:border-lime-500 dark:border-[#29342c]"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </header>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              <p className="font-bold">Could not load live dashboard data</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
          )}

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-extrabold">Dashboard Statistics</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A quick overview of your gym.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Link
                    key={stat.title}
                    href={stat.path}
                    className={`${cardClass} group relative overflow-hidden p-5 hover:-translate-y-1.5 hover:border-lime-500/70`}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-lime-100/50 dark:bg-[#C8FF3D]/[0.04]" />

                    <div className="relative flex items-center justify-between">
                      <div className={`${stat.bg} ${stat.color} rounded-2xl p-3.5`}>
                        <Icon size={24} strokeWidth={2.2} />
                      </div>
                      <ArrowUpRight
                        size={20}
                        className="text-gray-400 group-hover:text-lime-700 dark:group-hover:text-[#C8FF3D]"
                      />
                    </div>

                    <p className="relative mt-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <h3 className="relative mt-2 text-3xl font-extrabold">
                      {stat.value}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </section>

          <DashboardCharts
            memberChart={memberChart}
            period={period}
            setPeriod={setPeriod}
            bookingChartData={bookingChartData}
            classChartData={classChartData}
            loading={loading}
            error={error}
            chartTooltipStyle={chartTooltipStyle}
          />

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-extrabold">Quick Actions</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Quickly access your management pages.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  title: "Manage Members",
                  description: "View registered members",
                  path: "/Admin/Members",
                  icon: Users,
                },
                {
                  title: "Manage Bookings",
                  description: "Review class bookings",
                  path: "/Admin/Bookings",
                  icon: CalendarCheck,
                },
                {
                  title: "Manage Classes",
                  description: "View gym classes",
                  path: "/Admin/classes",
                  icon: Dumbbell,
                },
                {
                  title: "Payments & Orders",
                  description: "Review membership payments",
                  path: "/Admin/Orders",
                  icon: ShoppingBag,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${cardClass} group flex items-center gap-4 p-5 hover:-translate-y-1 hover:border-lime-500/70`}
                  >
                    <div className="rounded-2xl bg-lime-100 p-3.5 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
                      <Icon size={23} />
                    </div>
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <ArrowUpRight size={18} className="ml-auto text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={`${cardClass} flex items-start gap-4 border-l-4 border-l-lime-500 p-5 dark:border-l-[#C8FF3D]`}>
            <div className="rounded-2xl bg-lime-100 p-3.5 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
              {loading ? (
                <RefreshCw size={23} className="animate-spin" />
              ) : error ? (
                <Activity size={23} />
              ) : (
                <TrendingUp size={23} />
              )}
            </div>
            <div>
              <h2 className="font-bold">System Status</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {loading
                  ? "Loading dashboard data from the backend..."
                  : error
                    ? "Dashboard data could not be loaded. Check the backend connection and admin API."
                    : "Dashboard response loaded. Charts show the data returned by the admin API."}
              </p>
            </div>
          </section>

          <footer className="rounded-xl border border-gray-200/70 bg-white/70 px-4 py-4 text-center text-xs text-gray-400 dark:border-[#29342c] dark:bg-[#141a17]/70">
            <span className="font-bold text-lime-700 dark:text-[#C8FF3D]">
              FITZONE
            </span>{" "}
            Admin Dashboard · Manage smarter, train stronger.
          </footer>
        </div>
      </main>
    </div>
  );
}
