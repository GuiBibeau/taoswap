import { ConnectWalletButton } from "../components/connect-button";
import { PriceTracker } from "../components/price-tracker";
import Image from "next/image";
import { Suspense } from "react";

export const revalidate = 60; // Revalidate every minute for price tracker

export default function SwapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed inset-0 w-full h-full bg-repeat bg-noise opacity-20 bg-[length:350px] z-[-20] before:content-[''] before:absolute before:w-[2500px] before:h-[2500px] before:rounded-full before:blur-[100px] before:-left-[1000px] before:-top-[2000px] before:bg-sky-500 before:opacity-50 before:z-[-100] after:content-[''] after:absolute after:w-[2500px] after:h-[2500px] after:rounded-full after:blur-[100px] after:-right-[1000px] after:-bottom-[2000px] after:bg-sky-500 after:opacity-50 after:z-[-100]"></div>
      <nav className="flex relative items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="logo" width={150} height={100} />
          <Suspense fallback={null}>
            <PriceTracker />
          </Suspense>
        </div>
        <ConnectWalletButton />
      </nav>
      {children}
    </>
  );
}
