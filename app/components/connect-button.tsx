"use client";

import { Dialog } from "@/app/components/ui/dialog";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export function ConnectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isConnected) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700"
        >
          <span>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </button>

        <Dialog open={isOpen} onClose={handleClose}>
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Wallet Connected
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {address}
              </p>
            </div>

            <button
              onClick={() => {
                disconnect();
                handleClose();
              }}
              className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700"
            >
              Disconnect
            </button>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700"
      >
        <span>Connect Wallet</span>
        <ChevronDownIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </button>

      <Dialog open={isOpen} onClose={handleClose}>
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Connect Wallet
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose your preferred wallet connection method
            </p>
          </div>

          <div className="space-y-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                  handleClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 
                  text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700`}
              >
                <span className="flex items-center gap-2">
                  {connector.name === "Injected"
                    ? "Browser Wallet"
                    : connector.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
