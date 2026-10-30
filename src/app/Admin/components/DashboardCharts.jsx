"use client";

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

function ChartCard({ title, subtitle, children, action }) {
  return (
    <section className="group min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_25px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-lime-500/60 hover:shadow-[0_18px_40px_rgba(120,168,23,0.16)] dark:border-[#29342c] dark:bg-[#141a17] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)] dark:hover:border-[#C8FF3D]/40 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">
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

const chartColors = ["#C8FF3D", "#78A817", "#A78BFA", "#38BDF8"];

export default function DashboardCharts({
  memberChart,
  period,
  setPeriod,
  bookingChartData,
  classChartData,
  loading,
  error,
  chartTooltipStyle,
}) {
  const currentMemberData = memberChart?.[period] || [];

  return (
    <>
      {/* Members Growth */}
      <ChartCard
        title="Members Growth"
        subtitle="Registered members accumulated from the database"
        action={
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-[#29342c] dark:bg-[#0b0f0d]"
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
              data={currentMemberData}
              margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="memberGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#9FCC25"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="#9FCC25"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#808080"
                opacity={0.18}
              />

              <XAxis
                dataKey="label"
                tick={{ fill: "#888", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "#888", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip contentStyle={chartTooltipStyle} />

              <Area
                type="monotone"
                dataKey="members"
                name="Members"
                stroke="#78A817"
                strokeWidth={3}
                fill="url(#memberGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>

          {!loading && !error && currentMemberData.length === 0 && (
            <p className="mt-2 text-center text-sm text-gray-500">
              No member growth data available for this period.
            </p>
          )}
        </div>
      </ChartCard>

      {/* Bookings and Class Distribution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Bookings by Class"
          subtitle="Bookings grouped by workout type"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingChartData || []}
                margin={{ top: 10, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#808080"
                  opacity={0.18}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fill: "#888", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#888", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

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

            {!loading &&
              !error &&
              (!bookingChartData || bookingChartData.length === 0) && (
                <p className="mt-2 text-center text-sm text-gray-500">
                  No booking data available yet.
                </p>
              )}
          </div>
        </ChartCard>

        <ChartCard
          title="Class Distribution"
          subtitle="Classes grouped by category"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classChartData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  stroke="none"
                >
                  {(classChartData || []).map((entry, index) => (
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
                />
              </PieChart>
            </ResponsiveContainer>

            {!loading &&
              !error &&
              (!classChartData || classChartData.length === 0) && (
                <p className="mt-2 text-center text-sm text-gray-500">
                  No class distribution data available yet.
                </p>
              )}
          </div>
        </ChartCard>
      </div>
    </>
  );
}