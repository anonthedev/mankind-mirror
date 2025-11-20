import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id } = await params;

    console.log("Updating post:", id);
    console.log("Update data:", body);

    // You can update likes_count, shares_count, or comments
    const updateData: any = {};

    if (body.likes_count !== undefined) {
      updateData.likes_count = body.likes_count;
    }

    if (body.shares_count !== undefined) {
      updateData.shares_count = body.shares_count;
    }

    if (body.comments !== undefined) {
      updateData.comments = body.comments;
    }

    console.log("Final update data:", updateData);

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
