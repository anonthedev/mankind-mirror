// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const supabase = await createClient();

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { id } = await params;
//     const body = await request.json();
//     const { title, content } = body;

//     if (!title || !title.trim()) {
//       return NextResponse.json(
//         { success: false, error: "Title is required" },
//         { status: 400 }
//       );
//     }

//     const { data, error } = await supabase
//       .from("journal")
//       .update({ title, content: content || "" })
//       .eq("id", id)
//       .eq("user_id", user.id)
//       .select()
//       .single();

//     if (error) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ success: true, id: data.id });
//   } catch (error) {
//     console.error("Error updating journal:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const supabase = await createClient();

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { id } = await params;

//     const { error } = await supabase
//       .from("journal")
//       .delete()
//       .eq("id", id)
//       .eq("user_id", user.id);

//     if (error) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting journal:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { createClient } from "@/utils/supabase/server";
import { embedJournalEntry } from "@/lib/rag-service";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { title, content } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("journal")
      .update({ title, content: content || "" })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Generate embedding for RAG
    try {
      // Delete old embedding if exists
      await supabase.from("journal_embeddings").delete().eq("journal_id", id);

      // Create new embedding with combined title and content
      const fullContent = `Title: ${title}\n\nContent: ${content || ""}`;
      await embedJournalEntry(id, user.id, fullContent);
    } catch (embeddingError) {
      console.error("Error creating embedding:", embeddingError);
      // Don't fail the update if embedding fails, just log it
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Error updating journal:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Delete embedding first
    try {
      await supabase.from("journal_embeddings").delete().eq("journal_id", id);
    } catch (embeddingError) {
      console.error("Error deleting embedding:", embeddingError);
    }

    // Delete the journal
    const { error } = await supabase
      .from("journal")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting journal:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
