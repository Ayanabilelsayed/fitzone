"use client";

import ThemeToggle from "@/app/components/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UserRound,
  CalendarCheck,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Overview",
    path: "/Admin/Dashbord",
    icon: LayoutDashboard,
  },
  {
    name: "Members",
    path: "/Admin/Members",
    icon: Users,
  },
  {
    name: "Classes",
    path: "/Admin/Classes",
    icon: Dumbbell,
  },
  {
    name: "Trainers",
    path: "/Admin/Trainers",
    icon: UserRound,
  },
  {
    name: "Bookings",
    path: "/Admin/Bookings",
    icon: CalendarCheck,
  },
  {
    name: "Messages",
    path: "/Admin/Messages",
    icon: Mail,
  },
  {
    name: "Settings",
    path: "/Admin/Settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-5 text-gray-900 transition-colors duration-300 dark:border-[#29342c] dark:bg-[#0b0f0d] dark:text-white">

      {/* Logo and Theme Toggle */}
      <div className="mb-10 flex items-center justify-between gap-2">
        <Link
          href="/Admin/Dashbord"
          className="text-2xl font-extrabold tracking-tight"
        >
          FIT<span className="text-[#78A817] dark:text-[#C8FF3D]">ZONE</span>
        </Link>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 shadow-sm transition-colors duration-300 hover:border-[#78A817] dark:border-[#29342c] dark:bg-[#141a17] dark:hover:border-[#C8FF3D]">
          <ThemeToggle />
        </div>
      </div>

      {/* Menu Title */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        Admin Menu
      </p>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-300 ${
                isActive
                  ? "bg-[#78A817] font-semibold text-white dark:bg-[#C8FF3D] dark:text-black"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#78A817] dark:text-gray-300 dark:hover:bg-[#1d2621] dark:hover:text-[#C8FF3D]"
              }`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Link
        href="/login"
        className="mt-6 flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-colors duration-300 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        <LogOut size={20} strokeWidth={1.8} />
        <span>Logout</span>
      </Link>
    </aside>
  );
}
