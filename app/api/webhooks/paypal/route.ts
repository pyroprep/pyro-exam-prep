import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * PayPal API base URL — sandbox vs live based on NODE_ENV.
 */
const PAYPAL_API =
  process.env.NODE_ENV === "development"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/**
 * Creates a Supabase admin client using the service role key.
 * This bypasses RLS and is safe to use only in server-only routes
 * (never exposed to the client).
 */
function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "Grab it from your Supabase dashboard (Settings > API) and add it to .env.local.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

/**
 * Obtain an OAuth 2.0 access token from PayPal.
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? "";
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
 * Verify the PayPal webhook signature by calling PayPal's verification API.
 */
async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: unknown,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    console.error("PAYPAL_WEBHOOK_ID is not set in environment variables");
    return false;
  }

  const accessToken = await getAccessToken();

  const verificationRes = await fetch(
    `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: body,
      }),
    },
  );

  if (!verificationRes.ok) {
    const errBody = await verificationRes.text();
    console.error(
      `PayPal webhook verification error ${verificationRes.status}: ${errBody}`,
    );
    return false;
  }

  const verificationData = await verificationRes.json();
  return verificationData.verification_status === "SUCCESS";
}

/**
 * POST /api/webhooks/paypal
 *
 * PayPal webhook endpoint. Verifies the webhook signature using PayPal's
 * verify-webhook-signature API, then processes PAYMENT.CAPTURE.COMPLETED
 * events to upgrade the corresponding user's profile to premium using the
 * custom_id field (which contains the Supabase User ID).
 */
export async function POST(request: Request) {
  try {
    // Extract PayPal verification headers
    const transmissionId = request.headers.get("paypal-transmission-id") ?? "";
    const transmissionTime =
      request.headers.get("paypal-transmission-time") ?? "";
    const certUrl = request.headers.get("paypal-cert-url") ?? "";
    const authAlgo = request.headers.get("paypal-auth-algo") ?? "";
    const transmissionSig =
      request.headers.get("paypal-transmission-sig") ?? "";

    // Read the raw body
    const body = await request.json();

    // Verify the webhook signature
    const isValid = await verifyWebhookSignature(
      {
        "paypal-transmission-id": transmissionId,
        "paypal-transmission-time": transmissionTime,
        "paypal-cert-url": certUrl,
        "paypal-auth-algo": authAlgo,
        "paypal-transmission-sig": transmissionSig,
      },
      body,
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 },
      );
    }

    // Only process completed payment captures
    if (body.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ received: true });
    }

    const customId = body.resource?.custom_id;

    if (!customId) {
      console.error("PayPal webhook missing custom_id in resource");
      return NextResponse.json(
        { error: "Missing custom_id in resource" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", customId);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update user profile" },
        { status: 500 },
      );
    }

    console.log(`✅ User ${customId} upgraded to premium via PayPal`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}