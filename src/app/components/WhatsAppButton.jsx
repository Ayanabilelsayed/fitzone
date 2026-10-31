
"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "201206292495";

  const message =
    "Hello FITZONE! I'm interested in your fitness services. Could you please provide me with more information?";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with FITZONE on WhatsApp"
      className="fixed bottom-7 right-7 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white transition-all duration-300 hover:scale-110"
      style={{
        animation: "whatsappBounce 2s ease-in-out infinite",
        boxShadow:
          "0 0 15px rgba(37,211,102,0.8), 0 0 30px rgba(37,211,102,0.6), 0 0 50px rgba(37,211,102,0.4), 0 8px 25px rgba(0,0,0,0.3)",
      }}
    >
      <style jsx>{`
        @keyframes whatsappBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>

      <FaWhatsapp
        className="relative z-10 text-[38px]"
      />
    </a>
  );
}
