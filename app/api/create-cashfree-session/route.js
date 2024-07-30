import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export async function POST(request) {
  try {
    const { amount } = await request.json();

    const orderId = "order_" + Date.now();
    const customerId = "customer_" + Date.now();

    const orderRequest = {
      order_amount: amount / 100,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerId,
        customer_phone: "9999999999",
        customer_email: "customer@example.com",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      },
    };

    console.log("Sending request to Cashfree:", orderRequest);

    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);

    console.log("Cashfree response:", response.data);

    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    });
  } catch (error) {
    console.error(
      "Error creating Cashfree session:",
      error.response ? error.response.data : error
    );
    return NextResponse.json(
      { error: "Failed to create payment session", details: error.message },
      { status: 500 }
    );
  }
}
