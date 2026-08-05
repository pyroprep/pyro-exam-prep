import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

/**
 * POST /api/guarantee
 *
 * Submits a pass guarantee claim.
 * Request body: { examDate: string; examScore: number; details?: string }
 */
export async function POST(request: Request) {
  try {
    const {
      examDate,
      examScore,
      details,
    }: { examDate: string; examScore: number; details?: string } =
      await request.json();

    if (!examDate || typeof examScore !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: examDate and examScore." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to submit a claim." },
        { status: 401 },
      );
    }

    const { error } = await supabase.from("guarantee_claims").insert({
      user_id: user.id,
      exam_date: examDate,
      exam_score: examScore,
      details: details ?? null,
      status: "pending",
    });

    if (error) {
      console.error("Guarantee claim insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit guarantee claim." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guarantee route error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}