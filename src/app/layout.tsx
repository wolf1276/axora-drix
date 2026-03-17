import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AXORA — Drone Weather Flight Advisor",
  description:
    "Real-time drone flight safety advisor powered by live weather data. Know if it's safe to fly before you launch.",
  keywords: ["drone", "weather", "flight safety", "UAV", "wind", "real-time"],
  openGraph: {
    title: "AXORA — Drone Weather Flight Advisor",
    description: "Know if your drone can fly. Right now.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
