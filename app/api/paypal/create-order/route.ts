import { NextResponse } from "next/server";

/**
 * PayPal API base URL — sandbox vs live based on NODE_ENV.
 */
const PAYPAL_API =
  process.env.NODE_ENV === "development"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/**
 * Obtain an OAuth 2.0 access token from PayPal.
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId) {
    throw new Error(
      "NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set. " +
        "Add it to your .env.local file from your PayPal developer dashboard.",
    );
  }
  if (!clientSecret) {
    throw new Error(
      "PAYPAL_CLIENT_SECRET is not set. " +
        "Add it to your .env.local file from your PayPal developer dashboard.",
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`PayPal auth error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

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

    const accessToken = await getAccessToken();

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
              value: "19.99",
            },
            description: "Pyro Prep Academy Premium Unlock — Lifetime Access",
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