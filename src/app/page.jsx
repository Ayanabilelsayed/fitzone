
import "./globals.css";

export const metadata = {
  title: "FITZONE | Fitness Studio",
  description: "Your fitness journey starts here.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
