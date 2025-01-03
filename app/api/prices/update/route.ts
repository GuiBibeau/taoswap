import { fetchTaoPrice } from "@/app/lib/tokens/price-fetcher";
import {
  storeTokenPrice,
  storePriceError,
} from "@/app/lib/tokens/price-storage";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch only USD price
    const result = await fetchTaoPrice("usd");

    // Store the result in Redis
    if ("price" in result) {
      await storeTokenPrice(result);
    } else {
      await storePriceError(result, "usd");
    }

    // Return the fresh data
    return NextResponse.json(
      {
        success: true,
        data: result,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error updating price:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update price",
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
