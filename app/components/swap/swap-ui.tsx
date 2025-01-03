"use client";

import { ArrowDown, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTokenList, getToken } from "@/app/lib/tokens/tokens";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "../connect-button";

const BITTENSOR_TESTNET_CHAIN_ID = 945;

export function SwapUI() {
  const [arrowDown, setArrowDown] = useState(false);
  const { isConnected } = useAccount();

  const handleArrowDown = () => {
    setArrowDown(!arrowDown);
  };

  const newTokenList = Object.keys(getTokenList(BITTENSOR_TESTNET_CHAIN_ID));

  const tokenList = Object.keys(getTokenList(BITTENSOR_TESTNET_CHAIN_ID));

  const SELL_STYLE =
    "flex flex-col rounded-2xl border border-transparent bg-zinc-800 p-4";
  const BUY_STYLE =
    "border flex flex-col rounded-2xl border-opacity-10 border-white p-4";

  return (
    <div className="flex flex-col gap-1 bg-zinc-900 max-w-lg mx-auto mt-20 rounded-3xl p-2">
      <div className="relative flex flex-col gap-1">
        <button
          onClick={handleArrowDown}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-zinc-900 rounded-xl p-1 w-fit"
        >
          <div className="bg-zinc-800 rounded-xl p-2 w-fit">
            <ArrowDown
              className={`${
                arrowDown ? "rotate-180" : ""
              } transition-all ease-in-out duration-300`}
            />
          </div>
        </button>
        <div className={arrowDown ? SELL_STYLE : BUY_STYLE}>
          <span className="text-white text-opacity-50">Sell</span>
          <div className="flex gap-1 py-2">
            <input
              inputMode="decimal"
              autoComplete="off"
              type="number"
              className="bg-transparent w-full text-3xl focus:outline-none border-none text-white text-opacity-90 placeholder:text-white placeholder:text-opacity-50"
              placeholder="0"
            />
            <Dialog>
              <DialogTrigger className="rounded-full flex w-full max-w-fit gap-1 items-center p-1 border border-white bg-zinc-900 border-opacity-10">
                <Image src="/eth-icon.png" alt="ETH" width={30} height={30} />{" "}
                <span className="font-semibold">ETH</span> <ChevronDown />
              </DialogTrigger>
              <DialogContent className="p-0 max-w-sm !rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="pl-5 pt-5 pr-5">
                    Select a token
                  </DialogTitle>
                  <DialogDescription className="px-5">
                    Select a token to sell or buy
                  </DialogDescription>
                  <div className="px-5 pt-2">
                    <div className="bg-transparent flex items-center gap-2 px-4 w-full focus:outline-none border rounded-full text-white text-opacity-90 placeholder:text-white placeholder:text-opacity-50">
                      <Search className="w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent h-12"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="px-5 pt-2">Your tokens</span>
                    {newTokenList.splice(0, 2).map((token) => {
                      const tokenInfo = getToken(
                        BITTENSOR_TESTNET_CHAIN_ID,
                        token
                      );
                      return (
                        <div
                          className="flex justify-between px-5 py-2 hover:bg-zinc-800 ease-in-out duration-200 cursor-pointer"
                          key={token}
                        >
                          <div className="flex gap-2">
                            <Image
                              src={tokenInfo?.logoURI || "/favicon.svg"}
                              alt={tokenInfo?.symbol || "Token"}
                              width={40}
                              height={40}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {tokenInfo?.name}
                              </span>
                              <div className="flex gap-1 items-center">
                                <span className="text-white text-sm text-opacity-50">
                                  {tokenInfo?.symbol}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 items-end">
                            <span className="font-semibold">$10.00</span>
                            <span className="text-white text-opacity-50">
                              100
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Separator />

                  <div className="flex flex-col gap-1">
                    <span className="px-5 pt-2">Recent searches</span>
                    {newTokenList.splice(0, 1).map((token) => {
                      const tokenInfo = getToken(
                        BITTENSOR_TESTNET_CHAIN_ID,
                        token
                      );
                      return (
                        <div
                          className="flex justify-between px-5 py-2 hover:bg-zinc-800 ease-in-out duration-200 cursor-pointer"
                          key={token}
                        >
                          <div className="flex gap-2">
                            <Image
                              src={tokenInfo?.logoURI || "/favicon.svg"}
                              alt={tokenInfo?.symbol || "Token"}
                              width={40}
                              height={40}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {tokenInfo?.name}
                              </span>
                              <div className="flex gap-1 items-center">
                                <span className="text-white text-sm text-opacity-50">
                                  {tokenInfo?.symbol}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 items-end">
                            <span className="font-semibold">$10.00</span>
                            <span className="text-white text-opacity-50">
                              100
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-1">
                    {tokenList.map((token) => {
                      const tokenInfo = getToken(
                        BITTENSOR_TESTNET_CHAIN_ID,
                        token
                      );
                      return (
                        <div
                          className="flex justify-between px-5 py-2 hover:bg-zinc-800 ease-in-out duration-200 cursor-pointer"
                          key={token}
                        >
                          <div className="flex gap-2">
                            <Image
                              src={tokenInfo?.logoURI || "/favicon.svg"}
                              alt={tokenInfo?.symbol || "Token"}
                              width={40}
                              height={40}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {tokenInfo?.name}
                              </span>
                              <div className="flex gap-1 items-center">
                                <span className="text-white text-sm text-opacity-50">
                                  {tokenInfo?.symbol}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 items-end">
                            <span className="font-semibold">$10.00</span>
                            <span className="text-white text-opacity-50">
                              100
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-between text-sm text-white text-opacity-50">
            <span>$4.27M</span>
            <div className="flex gap-1 items-center">
              <span>{`<0.001 `}</span>
              <span className="font-semibold">ETH</span>
              <button className="bg-zinc-800 px-2 rounded-full text-zinc-500 font-semibold text-xs">
                Max
              </button>
            </div>
          </div>
        </div>
        <div className={arrowDown ? BUY_STYLE : SELL_STYLE}>
          <span className="text-white text-opacity-50">Buy</span>
          <div className="flex gap-1 py-2">
            <input
              inputMode="decimal"
              autoComplete="off"
              type="number"
              className="bg-transparent w-full text-3xl focus:outline-none border-none text-white text-opacity-90 placeholder:text-white placeholder:text-opacity-50"
              placeholder="0"
            />
            <Dialog>
              <DialogTrigger className="rounded-full flex w-full max-w-fit gap-1 items-center p-1 border border-white bg-zinc-900 border-opacity-10">
                <Image src="/eth-icon.png" alt="ETH" width={30} height={30} />{" "}
                <span className="font-semibold">ETH</span> <ChevronDown />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-between text-sm text-white text-opacity-50">
            <span>$4.27M</span>
          </div>
        </div>
      </div>

      {isConnected ? (
        <button className="rounded-2xl bg-zinc-700 py-5 font-semibold text-zinc-300 mt-1 hover:bg-zinc-600 ease-in-out duration-200">
          Enter amount
        </button>
      ) : (
        <ConnectWalletButton>Get started</ConnectWalletButton>
      )}
    </div>
  );
}
