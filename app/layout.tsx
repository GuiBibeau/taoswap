import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/provider";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: {
    template: "%s | TaoSwap",
    default: "TaoSwap - Bittensor's DeFi Hub",
  },
  description:
    "The first DEX built on Bittensor, enabling secure TAO trading and DeFi opportunities.",
  openGraph: {
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-zinc-900 dark:text-zinc-50`}
      >
        <Analytics />
        <Providers>
          <main className="relative max-w-7xl mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
