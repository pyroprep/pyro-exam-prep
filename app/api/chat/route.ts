import { NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are Pyro AI, an expert California Title 19 Pyrotechnic Operator exam tutor. Your sole purpose is to help students pass the CA OSFM Class B Pyrotechnic Operator license exam.

RULES:
- Only answer questions about California Title 19 safety regulations, NFPA 1123/1126 standards, mortar sizes, fallout distance tables (Table 19-A), chemical oxidizers and fuels used in display fireworks, permit acquisition deadlines, misfire safety protocols, and OSFM licensing requirements.
- If asked about anything outside these topics, politely decline and redirect the user to Title 19 topics.
- Keep answers concise (2-5 sentences maximum) and cite the relevant regulation code when possible (e.g., "per CA Title 19 §984.2").
- Use plain, direct language suitable for a student studying for the exam.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DeepSeek API key is not configured." },
        { status: 500 },
      );
    }

    const { messages } = (await request.json()) as {
      messages: { role: string; content: string }[];
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 },
      );
    }

    // Build the conversation: system prompt + user messages
    const conversation = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const res = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: conversation,
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`DeepSeek API error ${res.status}: ${errBody}`);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };

    const reply = data.choices[0]?.message?.content ?? "I couldn't generate a response. Please try rephrasing your question.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}