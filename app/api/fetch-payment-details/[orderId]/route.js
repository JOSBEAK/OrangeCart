import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export async function GET(request, { params }) {
  const { orderId } = params;

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    console.log("Order transactions fetched successfully:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching order transactions:",
      error.response ? error.response.data : error
    );
    return NextResponse.json(
      { error: "Failed to fetch order transactions", details: error.message },
      { status: 500 }
    );
  }
}
