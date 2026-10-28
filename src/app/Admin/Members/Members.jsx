
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Users,
  Database,
  CalendarDays,
  Crown,
  ShieldCheck,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const router = useRouter();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const pageClass =
    "bg-gray-50 text-gray-900 dark:bg-[#0b0f0d] dark:text-white";

  const cardClass =
    "border border-gray-200 bg-white shadow-sm dark:border-[#29342c] dark:bg-[#141a17]";

  const mutedClass = "text-gray-500 dark:text-gray-400";

  const tableHeaderClass =
    "bg-gray-100 text-gray-600 dark:bg-[#202820] dark:text-gray-300";

  async function loadMembers(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
      setError("");
    }

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

      const apiBaseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/$/, "");

      const response = await fetch(
        `${apiBaseUrl}/api/admin/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
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
        throw new Error(data.message || "Failed to load members");
      }

      const sortedMembers = [...(data.members || [])].sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;

        return Number(a.id) - Number(b.id);
      });

      setMembers(sortedMembers);
    } catch (err) {
      console.error("Members error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialMembers() {
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

        const apiBaseUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        ).replace(/\/$/, "");

        const response = await fetch(
          `${apiBaseUrl}/api/admin/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
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
          throw new Error(data.message || "Failed to load members");
        }

        const sortedMembers = [...(data.members || [])].sort((a, b) => {
          if (a.role === "admin" && b.role !== "admin") return -1;
          if (a.role !== "admin" && b.role === "admin") return 1;

          return Number(a.id) - Number(b.id);
        });

        if (!cancelled) {
          setMembers(sortedMembers);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Members error:", err);
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInitialMembers();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className={`flex min-h-screen ${pageClass}`}>
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mx-auto max-w-6xl">

          {/* Page Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold tracking-widest text-[#78A817]">
                FITZONE ADMIN
              </p>

              <h1 className="text-3xl font-bold">Members</h1>

              <p className={`mt-2 ${mutedClass}`}>
                Manage your registered gym members.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadMembers(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C8FF3D] px-4 py-2 font-semibold text-black transition hover:bg-[#b6eb32] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Statistics */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={`rounded-xl p-5 ${cardClass}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${mutedClass}`}>
                  Total Members
                </p>

                <Users size={22} className="text-[#78A817]" />
              </div>

              <p className="mt-3 text-3xl font-bold text-[#78A817]">
                {members.length}
              </p>
            </div>

            <div className={`rounded-xl p-5 ${cardClass}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${mutedClass}`}>
                  Data Source
                </p>

                <Database size={22} className="text-[#78A817]" />
              </div>

              <p className="mt-3 text-xl font-semibold">
                Neon PostgreSQL
              </p>
            </div>
          </div>

          {/* Members Table */}
          <div className={`overflow-hidden rounded-xl ${cardClass}`}>
           

            {loading ? (
              <div className={`flex items-center gap-3 p-8 ${mutedClass}`}>
                <RefreshCw size={18} className="animate-spin" />
                Loading members...
              </div>
            ) : error ? (
              <div className="p-6">
                <p className="text-red-500">{error}</p>

                <button
                  type="button"
                  onClick={() => loadMembers(true)}
                  className="mt-3 text-sm font-semibold text-[#78A817] hover:underline dark:text-[#C8FF3D]"
                >
                  Try again
                </button>
              </div>
            ) : members.length === 0 ? (
              <div className={`p-10 text-center ${mutedClass}`}>
                <Users size={32} className="mx-auto mb-3 opacity-60" />
                <p>No members found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={tableHeaderClass}>
                    <tr>
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Full Name</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Registered At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="border-t border-gray-100 transition hover:bg-gray-50 dark:border-[#29342c] dark:hover:bg-[#1d2621]"
                      >
                        {/* ID: Crown for admin, real database ID for members */}
                        <td className={`px-5 py-4 ${mutedClass}`}>
                          {member.role === "admin" ? (
                            <Crown
                              size={20}
                              className="text-[#78A817]"
                              aria-label="Administrator"
                            />
                          ) : (
                            member.id
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-medium">
                          {member.full_name}
                        </td>

                        <td className="px-5 py-4">
                          {member.email}
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          {member.role === "admin" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8FF3D]/20 px-3 py-1 text-xs font-semibold text-[#719b0b] dark:text-[#C8FF3D]">
                              <ShieldCheck size={15} />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                              Member
                            </span>
                          )}
                        </td>

                        <td className={`whitespace-nowrap px-5 py-4 ${mutedClass}`}>
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={15} />

                            {member.created_at
                              ? new Date(member.created_at).toLocaleDateString()
                              : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
