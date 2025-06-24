import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Air Quality Monitor - Jabodetabek",
  description:
    "Real-time air quality monitoring for Jakarta, Bogor, Depok, Tangerang, and Bekasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
