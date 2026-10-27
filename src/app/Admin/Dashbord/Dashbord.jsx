"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  Dumbbell,
  UserRound,
  CalendarCheck,
  ArrowUpRight,
  Activity,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

const chartColors = ["#C8FF3D", "#78A817", "#A78BFA", "#38BDF8"];

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
    path: "/Admin/Classes",
  },
  {
    title: "Total Trainers",
    value: "—",
    icon: UserRound,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    path: "/Admin/Trainers",
  },
  {
    title: "Total Bookings",
    value: "—",
    icon: CalendarCheck,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-400/10",
    path: "/Admin/Bookings",
  },
];

function ChartCard({ title, subtitle, children, action }) {
  return (
    <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-[#29342c] dark:bg-[#141a17] md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function normalizeGrowthData(rawGrowth) {
  const emptyPeriods = { "7 days": [], "30 days": [], "12 months": [] };

  // Supports an API that returns a single array of monthly rows.
  if (Array.isArray(rawGrowth)) {
    return {
      ...emptyPeriods,
      "12 months": rawGrowth.map((row) => ({
        label: row.label ?? row.month ?? "",
        members: Number(row.members ?? row.total_members ?? row.totalMembers ?? 0),
      })),
    };
  }

  // Supports an API that returns a separate array for each period.
  if (rawGrowth && typeof rawGrowth === "object") {
    return {
      "7 days": Array.isArray(rawGrowth["7 days"]) ? rawGrowth["7 days"] : [],
      "30 days": Array.isArray(rawGrowth["30 days"]) ? rawGrowth["30 days"] : [],
      "12 months": Array.isArray(rawGrowth["12 months"])
        ? rawGrowth["12 months"].map((row) => ({
            label: row.label ?? row.month ?? "",
            members: Number(row.members ?? row.total_members ?? row.totalMembers ?? 0),
          }))
        : [],
    };
  }

  return emptyPeriods;
}

export default function OverviewPage() {
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
    totalBookings: "—",
  });
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        const savedUser = sessionStorage.getItem("fitzoneUser");
        const token = sessionStorage.getItem("fitzoneToken");

        if (!savedUser || !token) {
          window.location.href = "/login";
          return;
        }

        const user = JSON.parse(savedUser);

        if (user.role !== "admin") {
          window.location.href = "/project";
          return;
        }

        setAdminName(user.fullName || user.full_name || "Admin");

        const apiBase = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        ).replace(/\/$/, "");
        const apiUrl = `${apiBase}/api/admin/dashboard`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const responseText = await response.text();
          console.error("Invalid API response:", {
            url: apiUrl,
            status: response.status,
            response: responseText.slice(0, 300),
          });
          throw new Error(`Invalid API response. HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard.");
        }

        if (!data.success || !data.stats || typeof data.stats !== "object") {
          throw new Error("Invalid dashboard response from backend.");
        }

        const apiStats = data.stats;

        setDashboardCounts({
          totalMembers: Number(apiStats.totalMembers ?? 0),
          totalClasses: Number(apiStats.totalClasses ?? 0),
          totalTrainers: Number(apiStats.totalTrainers ?? 0),
          totalBookings: Number(apiStats.totalBookings ?? 0),
        });

      const growth = apiStats.memberGrowth || {};

const normalizeRows = (rows) =>
  Array.isArray(rows)
    ? rows.map((row) => ({
        label: row.label ?? row.month ?? "",
        members: Number(
          row.members ?? row.total_members ?? row.totalMembers ?? 0
        ),
      }))
    : [];

setMemberChart({
  "7 days": normalizeRows(growth["7 days"]),
  "30 days": normalizeRows(growth["30 days"]),
  "12 months": normalizeRows(growth["12 months"]),
});

console.log("Member growth data:", growth);
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
        setError(err.message || "Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

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
            : dashboardCounts.totalBookings,
  }));

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#29342c] dark:bg-[#141a17]";

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#0b0f0d] dark:text-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-lime-700 dark:text-[#C8FF3D]">
                FITZONE ADMIN PANEL
              </p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {adminName}. Here is your gym summary.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-[#29342c] dark:bg-[#141a17]">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Admin Dashboard
            </div>
          </header>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              Could not load live dashboard data: {error}
            </div>
          )}

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">Dashboard Statistics</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A quick overview of your gym.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    key={stat.title}
                    href={stat.path}
                    className={`${cardClass} group p-5 transition hover:-translate-y-1 hover:border-lime-600 dark:hover:border-[#C8FF3D]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                        <Icon size={23} />
                      </div>
                      <ArrowUpRight
                        size={19}
                        className="text-gray-400 transition group-hover:text-lime-700 dark:group-hover:text-[#C8FF3D]"
                      />
                    </div>
                    <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <h3 className="mt-1 text-3xl font-extrabold">{stat.value}</h3>
                  </Link>
                );
              })}
            </div>
          </section>

          <ChartCard
            title="Members Growth"
            subtitle="Registered members accumulated from the database"
            action={
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none dark:border-[#29342c] dark:bg-[#0b0f0d]"
              >
                <option>7 days</option>
                <option>30 days</option>
                <option>12 months</option>
              </select>
            }
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={memberChart[period] || []}
                  margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9FCC25" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#9FCC25" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#808080" opacity={0.18} />
                  <XAxis dataKey="label" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141a17",
                      border: "1px solid #29342c",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    name="Members"
                    stroke="#78A817"
                    strokeWidth={3}
                    fill="url(#memberGradient)"
                    activeDot={{ r: 6, fill: "#C8FF3D" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              {!loading && !error && (memberChart[period] || []).length === 0 && (
                <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  No member growth data available for this period.
                </p>
              )}
            </div>
          </ChartCard>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ChartCard
              title="Bookings by Class"
              subtitle="Bookings grouped by workout type from Neon"
            >
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingChartData} margin={{ top: 10, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#808080" opacity={0.18} />
                    <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#141a17",
                        border: "1px solid #29342c",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="bookings" name="Bookings" fill="#78A817" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                {!loading && !error && bookingChartData.length === 0 && (
                  <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    No booking data available yet.
                  </p>
                )}
              </div>
            </ChartCard>

            <ChartCard
              title="Class Distribution"
              subtitle="Classes grouped by category from Neon"
            >
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {classChartData.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#141a17",
                        border: "1px solid #29342c",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: "var(--chart-label, #888)" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {!loading && !error && classChartData.length === 0 && (
                  <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    No class distribution data available yet.
                  </p>
                )}
              </div>
            </ChartCard>
          </div>

          <section>
            <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/Admin/Members"
                className={`${cardClass} flex items-center gap-4 p-5 transition hover:border-lime-600 dark:hover:border-[#C8FF3D]`}
              >
                <div className="rounded-xl bg-lime-100 p-3 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Manage Members</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">View registered members</p>
                </div>
              </Link>

              <Link
                href="/Admin/Bookings"
                className={`${cardClass} flex items-center gap-4 p-5 transition hover:border-lime-600 dark:hover:border-[#C8FF3D]`}
              >
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                  <CalendarCheck size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Manage Bookings</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Review class bookings</p>
                </div>
              </Link>

              <Link
                href="/Admin/Classes"
                className={`${cardClass} flex items-center gap-4 p-5 transition hover:border-lime-600 dark:hover:border-[#C8FF3D]`}
              >
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Dumbbell size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Manage Classes</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">View gym classes</p>
                </div>
              </Link>
            </div>
          </section>

          <section className={`${cardClass} flex items-start gap-4 p-5`}>
            <div className="rounded-xl bg-lime-100 p-3 text-lime-700 dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
              {loading ? <RefreshCw size={23} className="animate-spin" /> : <Activity size={23} />}
            </div>
            <div>
              <h2 className="font-bold">System Status</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {loading
                  ? "Loading dashboard data from the backend..."
                  : error
                    ? "Dashboard data could not be loaded. Check the backend connection and admin API."
                    : "Dashboard response loaded. Charts show the data returned by the admin API."}
              </p>
            </div>
            <TrendingUp className="ml-auto hidden text-lime-700 dark:text-[#C8FF3D] sm:block" size={22} />
          </section>

          <footer className="pb-3 text-center text-xs text-gray-400">
            FITZONE Admin Dashboard
          </footer>
        </div>
      </main>
    </div>
  );
}
