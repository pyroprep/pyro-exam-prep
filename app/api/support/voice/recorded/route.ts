import { NextResponse } from "next/server";
import { sendSupportSms } from "@/lib/support-notifications";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const from = String(form.get("From") ?? "unknown caller");
    const recordingUrl = String(form.get("RecordingUrl") ?? "");
    const transcription = String(form.get("TranscriptionText") ?? "");
    const callSid = String(form.get("CallSid") ?? "");
    const duration = String(form.get("RecordingDuration") ?? "");

    await sendSupportSms(
      [
        "New voicemail for Pyro Prep Academy",
        `From: ${from}`,
        `Duration: ${duration || "unknown"} seconds`,
        callSid ? `Call SID: ${callSid}` : null,
        recordingUrl ? `Recording: ${recordingUrl}` : null,
        transcription ? `Transcript: ${transcription}` : null,
      ]
        .filter((line): line is string => Boolean(line))
        .join("\n"),
    );

    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice">Thanks. Your message has been received.</Say></Response>`,
      {
        headers: { "Content-Type": "text/xml" },
      },
    );
  } catch (error) {
    console.error("Support voicemail error:", error);
    return NextResponse.json(
      { error: "Unable to process voicemail right now." },
      { status: 502 },
    );
  }
}
