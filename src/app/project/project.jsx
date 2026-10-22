"use client";

import { useState } from "react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Home from "../components/Home.jsx";
import Classes from "../components/Classes.jsx";
import Trainers from "../components/Trainers.jsx";
import Membership from "../components/Membership.jsx";
import Contact from "../components/Contact.jsx";


export default function Project() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main
        className={`min-h-screen overflow-x-clip ${
          darkMode ? "dark bg-[#0b0f0d] text-white" : "bg-white text-gray-900"
        }`}
      >
        <Home darkMode={darkMode} setDarkMode={setDarkMode} />
        <Classes darkMode={darkMode} setDarkMode={setDarkMode} />
        <Trainers darkMode={darkMode} setDarkMode={setDarkMode} />
        <Membership darkMode={darkMode} setDarkMode={setDarkMode} />
        <Contact darkMode={darkMode} setDarkMode={setDarkMode} />
        <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
      </main>
    </>
  );
}