/**
 * PayPal shared utilities.
 */

const PAYPAL_API =
  process.env.NODE_ENV === "development"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/**
 * Obtain an OAuth 2.0 access token from PayPal.
 */
export async function getPayPalAccessToken(): Promise<string> {
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