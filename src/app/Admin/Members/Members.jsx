
"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
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

        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(
          `${apiBaseUrl}/api/admin/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          sessionStorage.removeItem("fitzoneToken");
          sessionStorage.removeItem("fitzoneUser");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load members");
        }

        setMembers(data.members || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  return (

  <div className="flex min-h-screen bg-[#0b0f0d] text-white">
    <AdminSidebar />

    <main className="min-w-0 flex-1 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#C8FF3D]">
              FITZONE ADMIN
            </p>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="mt-2 text-gray-400">
              Manage your registered gym members.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-[#C8FF3D] px-4 py-2 font-semibold text-black hover:bg-[#b6eb32]"
          >
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#29342c] bg-[#141a17] p-5">
            <p className="text-sm text-gray-400">Total Members</p>
            <p className="mt-2 text-3xl font-bold text-[#C8FF3D]">
              {members.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#29342c] bg-[#141a17] p-5">
            <p className="text-sm text-gray-400">Data Source</p>
            <p className="mt-2 text-xl font-semibold">Neon PostgreSQL</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#29342c] bg-[#141a17]">
          <div className="border-b border-[#29342c] p-5">
            <h2 className="text-lg font-semibold">Registered Members</h2>
          </div>

          {loading ? (
            <p className="p-6 text-gray-300">Loading members...</p>
          ) : error ? (
            <p className="p-6 text-red-400">{error}</p>
          ) : members.length === 0 ? (
            <p className="p-6 text-gray-400">No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#202820] text-gray-300">
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
                      className="border-t border-[#29342c] hover:bg-[#1d2621]"
                    >
                      <td className="px-5 py-4">{member.id}</td>
                      <td className="px-5 py-4">
                        {member.full_name}
                      </td>
                      <td className="px-5 py-4">{member.email}</td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            member.role === "admin"
                              ? "rounded-full bg-[#C8FF3D]/15 px-3 py-1 text-[#C8FF3D]"
                              : "rounded-full bg-gray-700 px-3 py-1 text-gray-200"
                          }
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                        {member.created_at
                          ? new Date(member.created_at).toLocaleDateString()
                          : "—"}
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
