
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UserRound,
  CalendarCheck,
  ShoppingBag,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    path: "/Admin/Dashbord",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    path: "/Admin/Members",
    icon: Users,
  },
  {
    title: "Classes",
    path: "/Admin/classes",
    icon: Dumbbell,
  },
  {
    title: "Trainers",
    path: "/Admin/trainers",
    icon: UserRound,
  },
  {
    title: "Bookings",
    path: "/Admin/Bookings",
    icon: CalendarCheck,
  },
  {
    title: "Orders",
    path: "/Admin/Orders",
    icon: ShoppingBag,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem("fitzoneUser");
    sessionStorage.removeItem("fitzoneToken");

    window.dispatchEvent(new Event("fitzone-auth-changed"));

    router.replace("/login");
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-5 text-gray-900 dark:border-[#29342c] dark:bg-[#141a17] dark:text-white">
      <Link href="/" className="mb-10 text-center text-2xl font-black">
        FIT<span className="text-[#78A817] dark:text-[#C8FF3D]">ZONE</span>
        <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-gray-400">
          ADMIN PANEL
        </p>
      </Link>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#78A817] text-white shadow-md dark:bg-[#C8FF3D] dark:text-black"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1d2621]"
              }`}
            >
              <Icon size={19} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}
