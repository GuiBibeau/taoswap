"use client";
import React from "react";

import { TopGradient } from "../landing/top-gradient";
import { BottomGradient } from "../landing/bottom-gradient";
import { TopLines } from "../landing/top-lines";
import { BottomLines } from "../landing/bottom-lines";
import { SideLines } from "../landing/side-lines";

export function GenericHero() {
  return (
    <div className="relative h-full min-h-[40rem] w-full bg-white dark:bg-black">
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-4">
        <div className="relative overflow-hidden  bg-gray-50 dark:bg-black md:py-40">
          <TopLines />
          <BottomLines />
          <SideLines />
          <TopGradient />
          <BottomGradient />

          <div className="relative z-20 flex flex-col items-center justify-center overflow-hidden  p-4 md:p-12">
            <h1 className="bg-gradient-to-b from-black to-neutral-600 bg-clip-text py-4 text-center text-2xl text-transparent dark:from-white dark:to-[#999] md:text-4xl lg:text-7xl">
              TaoSwap: <br /> Bittensor&apos;s DeFi Hub
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
