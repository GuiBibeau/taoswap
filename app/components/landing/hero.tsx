"use client";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import Form from "next/form";

import { TopGradient } from "./top-gradient";
import { BottomGradient } from "./bottom-gradient";
import { TopLines } from "./top-lines";
import { BottomLines } from "./bottom-lines";
import { SideLines } from "./side-lines";
import { subscribeToWaitlist } from "@/app/actions/subscribe-to-waitlist";

export function Hero() {
  return (
    <div className="relative h-full min-h-[40rem] w-full bg-white dark:bg-black">
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-4">
        <div className="b relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-black md:py-40">
          <TopLines />
          <BottomLines />
          <SideLines />
          <TopGradient />
          <BottomGradient />

          <div className="relative z-20 flex flex-col items-center justify-center overflow-hidden rounded-3xl p-4 md:p-12">
            <Link
              href="#"
              className="flex items-center gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-1 text-center text-sm text-white"
            >
              <span>First DEX on Bittensor</span>
              <IconArrowRight className="h-4 w-4 text-white" />
            </Link>
            <h1 className="bg-gradient-to-b from-black to-neutral-600 bg-clip-text py-4 text-center text-2xl text-transparent dark:from-white dark:to-[#999] md:text-4xl lg:text-7xl">
              τaoSwap: <br /> Bittensor&apos;s DeFi Hub
            </h1>
            <p className="mx-auto max-w-2xl py-4 text-center text-base text-neutral-600 dark:text-neutral-300 md:text-lg">
              The first DEX built on Bittensor, TaoSwap enables secure TAO
              trading and DeFi opportunities. Built for the community, we
              provide trustless trading while creating new ways to earn and
              borrow.
            </p>
            <div className="flex w-full max-w-md flex-col gap-4 py-4">
              <Form action={subscribeToWaitlist}>
                <div>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="block w-full rounded-md border-0 bg-white px-4 py-1.5 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-2 text-center text-sm text-white"
                >
                  Sign Up for Updates{" "}
                  <IconArrowRight className="inline-block h-4 w-4" />
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
