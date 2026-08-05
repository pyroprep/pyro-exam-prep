import { NextResponse } from "next/server";
import { buildSupportBody, sendSupportSms, type SupportChatMessage } from "@/lib/support-notifications";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { messages?: SupportChatMessage[] };

    if (!payload.messages || payload.messages.length === 0) {
      return NextResponse.json({ error: "No chat transcript provided." }, { status: 400 });
    }

    const body = buildSupportBody(payload.messages);
    await sendSupportSms(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Support escalation error:", error);
    return NextResponse.json(
      { error: "Unable to route to live support right now." },
      { status: 502 },
    );
  }
}
