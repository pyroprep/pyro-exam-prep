import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";

const PAYPAL_API =
  process.env.NODE_ENV === "development"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/**
 * POST /api/paypal/create-order
 *
 * Creates a PayPal order with intent='CAPTURE' and passes the
 * user's Supabase ID into purchase_units[0].custom_id for
 * webhook-based premium upgrades.
 *
 * Request body: { userId: string }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required field: userId" },
        { status: 400 },
      );
    }

    const accessToken = await getPayPalAccessToken();

    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: userId,
            amount: {
              currency_code: "USD",
              value: "249.00",
            },
            description:
              "Pyro Prep Academy — Full Academy Course & Exam Prep (One-Time Payment, Lifetime Access)",
          },
        ],
      }),
    });

    if (!orderRes.ok) {
      const errBody = await orderRes.text();
      throw new Error(`PayPal order creation error ${orderRes.status}: ${errBody}`);
    }

    const orderData = await orderRes.json();

    // Return the PayPal Order ID so the frontend can render the button
    return NextResponse.json({ id: orderData.id });
  } catch (error) {
    console.error("PayPal create-order error:", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 },
    );
  }
}