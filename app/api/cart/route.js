import { NextResponse } from "next/server";

let lastFetchedTime = 0;
export async function GET() {
  const url = "https://dummyjson.com/carts/1";

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    if (Date.now() - lastFetchedTime < 300000) {
      console.log("Data fetched from cache");
    } else {
      console.log("Data fetched from API");
      lastFetchedTime = Date.now();
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart data" },
      { status: 500 }
    );
  }
}
