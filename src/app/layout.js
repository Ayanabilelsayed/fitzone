import "./globals.css";

export const metadata = {
  title: "FITZONE | Fitness Studio",
  description: "Your fitness journey starts here.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}