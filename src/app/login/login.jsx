"use client";
import Link from "next/link";
import { useState } from "react";



export default function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  


  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

   function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleRememberChange(event) {
     if (event.target.checked) {
      setRemember(true);
    } else {
      setRemember(false);
    }
  }

  function handleSubmit(event) {
  event.preventDefault();

  if (email.trim() === "" || password === "") {
    alert("Please fill in all fields");
    return;
  }

  ///////////////////////////// TODO: Connect to the Backend Login API
}


  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-6"
      style={{
        backgroundImage: "url('/login.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login container */}
      <section className="relative shadow-[0_0_30px_rgba(200,255,61,0.12),0_12px_40px_rgba(0,0,0,0.4)] z-10 mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-[#0b0f0d]/95 p-6 text-white backdrop-blur-md sm:p-8">
        {/* Logo */}
        <Link
          href="/"
          className="mb-6 block text-center text-3xl font-black tracking-wider text-white"
        >
          FIT<span className="text-[#C8FF3D]">ZONE</span>
        </Link>

        {/* Heading */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-black text-white sm:text-3xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#C5CEC8]">
            Sign in to continue your fitness journey.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value ={email}
              onChange={handleEmailChange}
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-[#2A352F] bg-[#1D2621] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#A5B0A8] focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              value ={password}
              onChange={handlePasswordChange}
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              minLength={8}
              required
              className="w-full rounded-xl border border-[#2A352F] bg-[#1D2621] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#A5B0A8] focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
            />

            <div className="mt-2 text-right">
              <Link
                href="/forgotpassword"
                className="text-xs font-semibold text-[#C8FF3D] transition hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex cursor-pointer items-center gap-3 text-sm text-[#C5CEC8]">
            <input
              type="checkbox"
              name="remember"
              checked={remember}  
              onChange={handleRememberChange}
            
              className="h-4 w-4 accent-[#C8FF3D]"
            />
            Remember me
          </label>

          {/* Submit */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-xl bg-[#C8FF3D] px-5 py-3.5 font-black uppercase tracking-wider text-[#0B0F0D] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8FF3D] focus:ring-offset-2 focus:ring-offset-[#141A17]"
          >
            Sign In →
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm leading-6 text-[#C5CEC8]">
          Don&apos;t have an account?{" "}
          <Link
            href="/Register"
            className="font-bold text-[#C8FF3D] transition hover:text-white"
          >
            Create account
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-5 text-center text-xs leading-5 text-[#A5B0A8]">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}
