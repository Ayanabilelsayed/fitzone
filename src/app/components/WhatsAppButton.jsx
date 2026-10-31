
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
      className="whatsapp-float fixed bottom-7 right-7 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white"
    >
      <span className="whatsapp-pulse"></span>
      <span className="whatsapp-glow"></span>

      <FaWhatsapp className="relative z-10 text-[38px] transition-transform duration-300" />
    </a>
  );
}
