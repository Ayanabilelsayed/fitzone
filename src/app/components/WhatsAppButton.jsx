
"use client";

import { MessageCircle } from "lucide-react";

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
      aria-label="Chat with us on WhatsApp"
      className="whatsapp-float fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#20BA5A] hover:shadow-2xl"
    >
      <span className="whatsapp-pulse"></span>

      <MessageCircle
        size={30}
        strokeWidth={2.2}
        className="relative z-10 transition-transform duration-300 hover:rotate-12"
      />
    </a>
  );
}
