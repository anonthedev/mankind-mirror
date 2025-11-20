// app/api/journal-chat/route.ts
import { answerFromJournals } from "@/lib/rag-service";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get answer from journals using RAG
    const result = await answerFromJournals(user.id, question);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in journal-chat API:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
