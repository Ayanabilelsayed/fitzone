"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../components/Home";

import Classes from "../components/Classes";
import Trainers from "../components/Trainers";
import Membership from "../components/Membership";
import Contact from "../components/Contact";
import WhatsAppButton from "../components/WhatsAppButton";

export default function UserHomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-[#0b0f0d] dark:text-white">
      <Header />

      <main>
        <Home />
        <Classes />
        <Trainers />
        <Membership />
        <Contact />
      </main>
          <WhatsAppButton />

      <Footer />
    </div>
  );
}