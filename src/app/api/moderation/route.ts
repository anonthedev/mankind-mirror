import { NextResponse } from "next/server";
import { moderateContent } from "@/utils/moderation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const result = await moderateContent(content);

    return NextResponse.json({
      success: true,
      flagged: result.flagged,
      message: result.message,
      categories: result.categories,
      categoryScores: result.categoryScores,
    });
  } catch (error) {
    console.error("Error in moderation API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to moderate content" },
      { status: 500 }
    );
  }
}

