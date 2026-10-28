
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    title: "Total Bookings",
    value: "—",
    icon: CalendarCheck,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-400/10",
    path: "/Admin/Bookings",
  },
];

const cardClass =
  "rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.07)] transition-all duration-300 dark:border-[#29342c] dark:bg-[#141a17] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]";

function ChartCard({ title, subtitle, children, action }) {
  return (
    <section
      className={`${cardClass} group min-w-0 p-5 hover:-translate-y-1 hover:border-lime-500/60 hover:shadow-[0_18px_40px_rgba(120,168,23,0.16)] dark:hover:border-[#C8FF3D]/40 dark:hover:shadow-[0_18px_40px_rgba(200,255,61,0.08)] md:p-6`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-gray-900 transition-colors group-hover:text-lime-700 dark:text-white dark:group-hover:text-[#C8FF3D]">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const normalizeRows = (rows) =>
  Array.isArray(rows)
    ? rows.map((row) => ({
        label: row.label ?? row.month ?? "",
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
    totalBookings: "—",
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

      const user = JSON.parse(savedUser);

      if (user.role !== "admin") {
        router.push("/project");
        return;
      }

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

      if (response.status === 401) {
        sessionStorage.removeItem("fitzoneToken");
        sessionStorage.removeItem("fitzoneUser");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard.");
      }

      if (!data.success || !data.stats || typeof data.stats !== "object") {
        throw new Error("Invalid dashboard response from backend.");
      }

      if (cancelled) return;

      const apiStats = data.stats;

      const growth = apiStats.memberGrowth || {};

      setDashboardCounts({
        totalMembers: Number(apiStats.totalMembers ?? 0),
        totalClasses: Number(apiStats.totalClasses ?? 0),
        totalTrainers: Number(apiStats.totalTrainers ?? 0),
        totalBookings: Number(apiStats.totalBookings ?? 0),
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
              bookings: Number(
                row.bookings ?? row.count ?? row.total ?? 0
              ),
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

  const chartTooltipStyle = {
    backgroundColor: "#141a17",
    border: "1px solid #29342c",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#0b0f0d] dark:text-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        {/* Main dashboard container with OUTER shadow */}
        <div className="mx-auto max-w-7xl space-y-8 rounded-3xl border border-gray-200/70 bg-gradient-to-br from-white via-gray-50 to-lime-50/40 p-4 shadow-[0_15px_50px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(120,168,23,0.10)] dark:border-[#29342c] dark:bg-none dark:bg-[#101612] dark:shadow-[0_15px_50px_rgba(0,0,0,0.40)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.50)] sm:p-6 lg:space-y-9 lg:p-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-[0_5px_18px_rgba(0,0,0,0.04)] dark:border-[#29342c] dark:bg-[#141a17]/80 dark:shadow-[0_5px_18px_rgba(0,0,0,0.18)]">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:text-[#C8FF3D]">
                FITZONE ADMIN
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Manage your gym and monitor its performance.
              </p>
            </div>

          
          </header>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-[0_6px_20px_rgba(239,68,68,0.08)] dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              <p className="font-bold">Could not load live dashboard data</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
          )}

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Dashboard Statistics
              </h2>
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
                    className={`${cardClass} group relative overflow-hidden p-5 hover:-translate-y-1.5 hover:border-lime-500/70 hover:shadow-[0_18px_40px_rgba(120,168,23,0.18)] dark:hover:border-[#C8FF3D]/50 dark:hover:shadow-[0_18px_40px_rgba(200,255,61,0.08)]`}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-lime-100/50 transition-transform duration-300 group-hover:scale-125 dark:bg-[#C8FF3D]/[0.04]" />

                    <div className="relative flex items-center justify-between">
                      <div
                        className={`${stat.bg} ${stat.color} rounded-2xl p-3.5 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                      >
                        <Icon size={24} strokeWidth={2.2} />
                      </div>

                      <ArrowUpRight
                        size={20}
                        className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-lime-700 dark:group-hover:text-[#C8FF3D]"
                      />
                    </div>

                    <p className="relative mt-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>

                    <h3 className="relative mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                      {stat.value}
                    </h3>

                  
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
                className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium shadow-sm outline-none transition-all hover:border-lime-500 focus:ring-2 focus:ring-lime-500/20 dark:border-[#29342c] dark:bg-[#0b0f0d]"
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
                  <Tooltip contentStyle={chartTooltipStyle} />

                  <Area
                    type="monotone"
                    dataKey="members"
                    name="Members"
                    stroke="#78A817"
                    strokeWidth={3}
                    fill="url(#memberGradient)"
                    activeDot={{ r: 6, fill: "#C8FF3D", stroke: "#78A817", strokeWidth: 2 }}
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
                  <BarChart
                    data={bookingChartData}
                    margin={{ top: 10, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#808080" opacity={0.18} />
                    <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar
                      dataKey="bookings"
                      name="Bookings"
                      fill="#78A817"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={55}
                    />
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
                      stroke="none"
                    >
                      {classChartData.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip contentStyle={chartTooltipStyle} />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: "var(--chart-label, #888)" }}>
                          {value}
                        </span>
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
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Quickly access your management pages.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Link
                href="/Admin/Members"
                className={`${cardClass} group flex items-center gap-4 p-5 hover:-translate-y-1 hover:border-lime-500/70 hover:shadow-[0_16px_35px_rgba(120,168,23,0.16)] dark:hover:border-[#C8FF3D]/50`}
              >
                <div className="rounded-2xl bg-lime-100 p-3.5 text-lime-700 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
                  <Users size={23} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 transition-colors group-hover:text-lime-700 dark:text-white dark:group-hover:text-[#C8FF3D]">
                    Manage Members
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    View registered members
                  </p>
                </div>
                <ArrowUpRight className="ml-auto text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
              </Link>

              <Link
                href="/Admin/Bookings"
                className={`${cardClass} group flex items-center gap-4 p-5 hover:-translate-y-1 hover:border-lime-500/70 hover:shadow-[0_16px_35px_rgba(120,168,23,0.16)] dark:hover:border-[#C8FF3D]/50`}
              >
                <div className="rounded-2xl bg-purple-100 p-3.5 text-purple-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md dark:bg-purple-500/10 dark:text-purple-400">
                  <CalendarCheck size={23} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 transition-colors group-hover:text-lime-700 dark:text-white dark:group-hover:text-[#C8FF3D]">
                    Manage Bookings
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Review class bookings
                  </p>
                </div>
                <ArrowUpRight className="ml-auto text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
              </Link>

              <Link
                href="/Admin/Classes"
                className={`${cardClass} group flex items-center gap-4 p-5 hover:-translate-y-1 hover:border-lime-500/70 hover:shadow-[0_16px_35px_rgba(120,168,23,0.16)] dark:hover:border-[#C8FF3D]/50`}
              >
                <div className="rounded-2xl bg-blue-100 p-3.5 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md dark:bg-blue-500/10 dark:text-blue-400">
                  <Dumbbell size={23} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 transition-colors group-hover:text-lime-700 dark:text-white dark:group-hover:text-[#C8FF3D]">
                    Manage Classes
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    View gym classes
                  </p>
                </div>
                <ArrowUpRight className="ml-auto text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
              </Link>
            </div>
          </section>

          <section
            className={`${cardClass} flex items-start gap-4 border-l-4 border-l-lime-500 p-5 hover:shadow-[0_14px_35px_rgba(120,168,23,0.12)] dark:border-l-[#C8FF3D]`}
          >
            <div className="rounded-2xl bg-lime-100 p-3.5 text-lime-700 shadow-sm dark:bg-[#C8FF3D]/10 dark:text-[#C8FF3D]">
              {loading ? (
                <RefreshCw size={23} className="animate-spin" />
              ) : (
                <Activity size={23} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                System Status
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {loading
                  ? "Loading dashboard data from the backend..."
                  : error
                    ? "Dashboard data could not be loaded. Check the backend connection and admin API."
                    : "Dashboard response loaded. Charts show the data returned by the admin API."}
              </p>
            </div>

            <TrendingUp
              className="ml-auto hidden text-lime-700 dark:text-[#C8FF3D] sm:block"
              size={23}
            />
          </section>

          <footer className="rounded-xl border border-gray-200/70 bg-white/70 px-4 py-4 text-center text-xs text-gray-400 shadow-sm dark:border-[#29342c] dark:bg-[#141a17]/70">
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
