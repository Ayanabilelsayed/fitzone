
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log("LOGIN RESPONSE:", data);

    if (!data?.user || !data?.token) {
      alert(data?.message || "Login failed. Please try again.");
      return;
    }

    // Save user information
    sessionStorage.setItem(
      "fitzoneUser",
      JSON.stringify(data.user)
    );

    // Save authentication token
    sessionStorage.setItem("fitzoneToken", data.token);

    // Notify other components
    window.dispatchEvent(new Event("fitzone-auth-changed"));

    console.log("USER ROLE:", data.user.role);
    console.log(
      "SAVED USER:",
      sessionStorage.getItem("fitzoneUser")
    );
    console.log(
      "TOKEN EXISTS:",
      !!sessionStorage.getItem("fitzoneToken")
    );

    alert("Login successful!");

    // Navigate according to user role
    if (data.user.role?.toLowerCase() === "admin") {
      console.log("NAVIGATING TO ADMIN DASHBOARD");
      router.push("/Admin/Dashbord");
    } else {
      console.log("NAVIGATING TO USER PROJECT");
      router.push("/project");
    }

  } catch (error) {
    console.error("Login Error:", error);
    alert(error.message || "Something went wrong. Please try again.");

  } finally {
    setLoading(false);
  }
};

       

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          <Link href="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
