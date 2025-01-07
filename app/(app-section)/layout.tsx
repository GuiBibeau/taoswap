import { ContextProvider } from "../components/provider";
import { headers } from "next/headers";
import { Logo } from "../components/ui/logo";
import { Suspense } from "react";
import { PriceTracker } from "../components/price-tracker";
import { ConnectButton } from "../components/connect-button";

export const revalidate = 60; // Revalidate every minute for price tracker

export default async function SwapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = decodeURIComponent((await headers()).get("cookie") || "");

  return (
    <ContextProvider cookies={cookies}>
      <div className="w-full border-b border-gray-200/5 dark:border-gray-200/[0.03]">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex relative items-center justify-between py-6 min-h-[72px]">
            <div className="flex items-center gap-4 min-h-[40px]">
              <Logo />
              <Suspense fallback={<div className="w-[200px]" />}>
                <PriceTracker />
              </Suspense>
            </div>
            <ConnectButton />
          </nav>
        </div>
      </div>
      {children}
    </ContextProvider>
  );
}
