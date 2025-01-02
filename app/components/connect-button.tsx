"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="flex items-center gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 md:px-10 py-2 text-center text-white hover:opacity-80 duration-150"
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-10 py-2 text-center text-white hover:opacity-80 duration-150"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex flex-col gap-1 md:flex-row">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-2 text-center text-white"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        className={`w-3 h-3 rounded-full bg-[${chain.iconBackground}] overflow-hidden mr-1`}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={12}
                            height={12}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <ChevronDown />
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-2 text-center text-white"
                  >
                    {account.displayName}
                    {account.displayBalance ? (
                      <span className="font-semibold">
                        ({account.displayBalance})
                      </span>
                    ) : (
                      ""
                    )}
                    <ChevronDown />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
