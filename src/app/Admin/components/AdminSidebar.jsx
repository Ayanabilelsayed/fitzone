
"use client";

import Link from "next/link";
import AdminSidebar from "../components/AdminSidebar";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UserRound,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Members",
    value: "—",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-400/10",
    path: "/Admin/Members",
  },
  {
    title: "Total Classes",
    value: "—",
    icon: Dumbbell,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-400/10",
    path: "/Admin/classes",
  },
  {
    title: "Total Trainers",
    value: "—",
    icon: UserRound,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-400/10",
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

export default function Dashbord() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0f0d] dark:text-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#78A817] dark:text-[#C8FF3D]">
              FITZONE ADMIN PANEL
            </p>

            <h1 className="text-3xl font-extrabold md:text-4xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage your gym members, classes, trainers, and orders.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-[#29342c] dark:bg-[#141a17]">
            <LayoutDashboard
              size={20}
              className="text-[#78A817] dark:text-[#C8FF3D]"
            />
            <span className="text-sm font-medium">Overview</span>
          </div>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.title}
                href={stat.path}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#78A817]/50 hover:shadow-lg dark:border-[#29342c] dark:bg-[#141a17] dark:hover:border-[#C8FF3D]/50"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <Icon size={23} className={stat.color} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-gray-400 transition group-hover:text-[#78A817] dark:group-hover:text-[#C8FF3D]"
                  />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {stat.value}
                </h2>

                <p className="mt-3 text-xs text-gray-400">
                  View details
                </p>
              </Link>
            );
          })}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#29342c] dark:bg-[#141a17]">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#78A817]/10 p-3 dark:bg-[#C8FF3D]/10">
              <ShoppingBag
                size={24}
                className="text-[#78A817] dark:text-[#C8FF3D]"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">Payments & Orders</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review membership orders and payment statuses.
              </p>
            </div>
          </div>

          <Link
            href="/Admin/Orders"
            className="inline-flex items-center gap-2 rounded-xl bg-[#78A817] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[#C8FF3D] dark:text-black"
          >
            View All Orders
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>
    </div>
  );
}
