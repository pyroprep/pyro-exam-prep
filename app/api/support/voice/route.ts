import { NextResponse } from "next/server";

const TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thanks for calling Pyro Prep Academy. Please leave your name, callback number, and question after the beep. We will follow up as soon as possible.</Say>
  <Record action="/api/support/voice/recorded" method="POST" maxLength="120" playBeep="true" timeout="5" transcribe="true" />
  <Say voice="alice">We did not receive a message. Goodbye.</Say>
</Response>`;

function buildResponse() {
  return new NextResponse(TWIML, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function GET() {
  return buildResponse();
}

export async function POST() {
  return buildResponse();
}
