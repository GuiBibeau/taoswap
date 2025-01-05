// poolHelpers.test.ts

import { describe, it, expect } from "vitest";
import {
  getPriceFromSqrtPriceX96,
  getPriceFromTick,
  parseLiquidity,
} from "./pool-utils";

describe("getPriceFromSqrtPriceX96", () => {
  it("computes a price of 1 when sqrtPriceX96 = 2^96", () => {
    // 2^96 as BigInt
    const Q96 = BigInt(1) << BigInt(96);

    // If sqrtPriceX96 = 2^96, then sqrt(P) = 1 => P = 1
    const price = getPriceFromSqrtPriceX96(Q96);
    expect(price).toBeCloseTo(1, 12); // within 1e-12
  });

  it("computes the correct price for a known large sqrtPriceX96", () => {
    // Example from your data: ~ 1.771595571142957e30
    // "1771595571142957102961017161607"
    const sqrtPriceStr = "1771595571142957102961017161607";
    const sqrtPriceBigInt = BigInt(sqrtPriceStr);

    // We expect ~500 (give or take) for P
    const price = getPriceFromSqrtPriceX96(sqrtPriceBigInt);
    // The typical approximate is ~499-500 range
    expect(price).toBeGreaterThan(400);
    expect(price).toBeLessThan(600);
  });
});

describe("getPriceFromTick", () => {
  it("returns 1 when tick = 0", () => {
    const price = getPriceFromTick(0);
    expect(price).toBeCloseTo(1, 12);
  });

  it("returns correct price for tick = 62149 (~500)", () => {
    const price = getPriceFromTick(62149);
    // Usually about 500
    expect(price).toBeGreaterThan(400);
    expect(price).toBeLessThan(600);
  });
});

describe("parseLiquidity", () => {
  it("returns a bigint for liquidityStr", () => {
    const liquidityStr = "138233845669244492940";
    const result = parseLiquidity(liquidityStr) as bigint;
    expect(typeof result).toBe("bigint");
    expect(result.toString()).toBe(liquidityStr);
  });

  it("returns a short display string when toDisplay = true", () => {
    // Something big enough to test short formatting
    const liquidityStr = "1234567890123"; // ~ 1.234567890123e12
    const displayStr = parseLiquidity(liquidityStr, true) as string;

    // Expect something like "1.23T", "1.23B", etc.
    // Our code doesn't handle "T" for trillions, but it does "B" for billions.
    // So let's see if it hits the billions path:
    // 1.234567890123e12 is 1234.5679 billions => "1234.57B"
    // But our naive code only checks up to 1e9 => "xxxB"
    // For 1.234e12 -> (1.234e12 / 1e9) => 1234.567 => "1234.57B"
    expect(displayStr).toContain("B");
  });
});
