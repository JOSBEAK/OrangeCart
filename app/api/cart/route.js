import { NextResponse } from "next/server";
import NodeCache from "node-cache";
import crypto from "crypto";

const cache = new NodeCache({ stdTTL: 300 });

function generateCacheKey(url) {
  return crypto.createHash("md5").update(url).digest("hex");
}

export async function GET() {
  const url = "https://dummyjson.com/carts/1";
  const cacheKey = generateCacheKey(url);

  // Check if data is in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Serving from cache");
    return NextResponse.json(cachedData);
  }

  try {
    console.log("Fetching fresh data");
    const res = await fetch(url);
    const data = await res.json();

    // Store data in cache
    cache.set(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart data" },
      { status: 500 }
    );
  }
}
