import { ContextProvider } from "../components/provider";
import { headers } from "next/headers";

export const revalidate = 60; // Revalidate every minute for price tracker

export default async function SwapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <>
      <ContextProvider cookies={cookies}>{children}</ContextProvider>
    </>
  );
}
