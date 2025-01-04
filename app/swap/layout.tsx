import { PriceTracker } from "../components/price-tracker";
import { Suspense } from "react";
import { ConnectButton } from "../components/connect-button";
import { Logo } from "../components/ui/logo";

export const revalidate = 60; // Revalidate every minute for price tracker

export default function SwapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
      <div>{children}</div>
    </>
  );
}
