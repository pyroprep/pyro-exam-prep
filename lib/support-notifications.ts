export interface SupportChatMessage {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_SUPPORT_PHONE_NUMBER = "+18059565453";
const MAX_SMS_BODY_LENGTH = 1300;

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

export function buildSupportBody(
  messages: SupportChatMessage[],
  source = "Pyro Prep Academy chat",
) {
  const transcript = messages
    .map((message) => `${message.role === "user" ? "User" : "AI"}: ${message.content}`)
    .join("\n");

  return truncate(
    [
      `${source} support request`,
      "",
      transcript,
      "",
      "Please follow up with this customer.",
    ].join("\n"),
    MAX_SMS_BODY_LENGTH,
  );
}

export async function sendSupportSms(body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const toNumber = process.env.SUPPORT_PHONE_NUMBER ?? DEFAULT_SUPPORT_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    throw new Error(
      "Twilio support routing is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and SUPPORT_PHONE_NUMBER.",
    );
  }

  const authorization = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: toNumber,
        Body: body,
      }).toString(),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Twilio SMS request failed with ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<{ sid: string }>;
}
