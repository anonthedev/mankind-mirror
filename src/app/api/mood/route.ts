import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { recordMood } from "@/utils/streak";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mood } = body;

    if (!mood) {
      return NextResponse.json(
        { success: false, error: "Mood is required" },
        { status: 400 }
      );
    }

    const result = await recordMood(user.id, mood);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording mood:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}