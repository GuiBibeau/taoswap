import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/provider";
import { Analytics } from "@vercel/analytics/react";
import { ConnectWalletButton } from "./components/connect-button";
import Image from "next/image";

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
          <main className="relative max-w-7xl mx-auto">
            <div className="fixed inset-0 w-full h-full bg-repeat bg-noise opacity-20 bg-[length:350px] z-[-20] before:content-[''] before:absolute before:w-[2500px] before:h-[2500px] before:rounded-full before:blur-[100px] before:-left-[1000px] before:-top-[2000px] before:bg-sky-500 before:opacity-50 before:z-[-100] after:content-[''] after:absolute after:w-[2500px] after:h-[2500px] after:rounded-full after:blur-[100px] after:-right-[1000px] after:-bottom-[2000px] after:bg-sky-500 after:opacity-50 after:z-[-100]"></div>
            <nav className="flex relative items-center justify-between py-6">
              <Image src="/logo.svg" alt="logo" width={150} height={100} />
              <ConnectWalletButton />
            </nav>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
