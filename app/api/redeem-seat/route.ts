import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

/**
 * POST /api/redeem-seat
 *
 * Redeems a B2B multi-seat invite token and grants the user premium access.
 * Request body: { token: string }
 */
export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token?: string };

    if (!token) {
      return NextResponse.json(
        { error: "Missing invite token." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    // Look up the invite
    const { data: invite, error: lookupError } = await supabase
      .from("seat_invites")
      .select("*")
      .eq("token", token)
      .single();

    if (lookupError || !invite) {
      return NextResponse.json(
        { error: "Invalid or expired invite token." },
        { status: 404 },
      );
    }

    // Check expiry
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This invite has expired." },
        { status: 410 },
      );
    }

    // Check remaining seats
    if (invite.remaining_seats <= 0) {
      return NextResponse.json(
        { error: "No seats remaining for this invite." },
        { status: 410 },
      );
    }

    // Determine the user ID from the auth session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to redeem a seat." },
        { status: 401 },
      );
    }

    // Mark user as premium
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to activate premium access." },
        { status: 500 },
      );
    }

    // Decrement remaining seats
    const { error: decrementError } = await supabase
      .from("seat_invites")
      .update({ remaining_seats: invite.remaining_seats - 1 })
      .eq("id", invite.id);

    if (decrementError) {
      console.error("Seat decrement error:", decrementError);
    }

    // Optionally link user to company account
    if (invite.company_account_id) {
      await supabase.from("company_members").upsert(
        {
          company_account_id: invite.company_account_id,
          user_id: user.id,
          role: "member",
        },
        { onConflict: "company_account_id,user_id" },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seat redeemed successfully. Premium access activated.",
    });
  } catch (error) {
    console.error("Redeem seat error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}