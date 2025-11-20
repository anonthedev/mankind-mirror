import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getTodayMood } from "@/utils/streak";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ mood: null });
    }

    const mood = await getTodayMood(user.id);

    return NextResponse.json({ mood });
  } catch (error) {
    console.error("Error fetching today's mood:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

