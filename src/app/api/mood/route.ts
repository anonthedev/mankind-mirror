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
    const { mood, sleep, gratefulness } = body;

    if (!mood || !sleep || !gratefulness) {
      return NextResponse.json(
        { success: false, error: "All fields (mood, sleep, gratefulness) are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(gratefulness) || gratefulness.length !== 3) {
        return NextResponse.json(
            { success: false, error: "Please provide exactly 3 things you are grateful for" },
            { status: 400 }
        );
    }

    const result = await recordMood(user.id, { mood, sleep, gratefulness });

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