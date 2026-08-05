import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const PAYPAL_API =
  process.env.NODE_ENV === "development"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/**
 * POST /api/checkout
 *
 * Creates a PayPal order with optional promo code support.
 * Request body: { userId: string, promoCode?: string }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId: string;
      promoCode?: string;
    };

    const { userId, promoCode } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required field: userId" },
        { status: 400 },
      );
    }

    // Validate promo code if provided (basic validation)
    let discount = 0;
    if (promoCode) {
      const code = promoCode.trim().toUpperCase();
      if (code === "PYRO50") {
        discount = 0.5; // 50% off
      } else if (code === "PYRO25") {
        discount = 0.25; // 25% off
      } else {
        return NextResponse.json(
          { error: "Invalid promo code." },
          { status: 400 },
        );
      }
    }

    const accessToken = await getPayPalAccessToken();

    const baseAmount = discount > 0 ? (249.0 * (1 - discount)).toFixed(2) : "249.00";

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
              value: baseAmount,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: baseAmount,
                },
              },
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

    // Store promo code usage in Supabase for audit
    if (promoCode && userId) {
      try {
        const supabase = await createSupabaseServerClient();
        await supabase.from("promo_redemptions").insert({
          user_id: userId,
          promo_code: promoCode.trim().toUpperCase(),
          discount_percent: Math.round(discount * 100),
        });
      } catch {
        // Non-blocking: continue with order creation even if audit log fails
      }
    }

    return NextResponse.json({ id: orderData.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}