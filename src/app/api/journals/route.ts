// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";
// import { awardJournalPoints } from "@/utils/points";

// export async function POST(request: Request) {
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
//       .insert({ title, content: content || "", user_id: user.id })
//       .select()
//       .single();

//     if (error) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 400 }
//       );
//     }

//     // Award points for journal creation
//     await awardJournalPoints(user.id);

//     return NextResponse.json({ success: true, id: data.id });
//   } catch (error) {
//     console.error("Error creating journal:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { createClient } from "@/utils/supabase/server";
import { embedJournalEntry } from "@/lib/rag-service";
import { NextResponse } from "next/server";
import { awardJournalPoints } from "@/utils/points";

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
    const { title, content } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("journal")
      .insert({ title, content: content || "", user_id: user.id })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Award points for journal creation
    await awardJournalPoints(user.id);

    // Create embedding for RAG
    try {
      const fullContent = `Title: ${title}\n\nContent: ${content || ""}`;
      await embedJournalEntry(data.id, user.id, fullContent);
      console.log("✅ Embedding created for journal:", data.id);
    } catch (embeddingError) {
      console.error("⚠️ Error creating embedding:", embeddingError);
      // Don't fail the journal creation if embedding fails
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Error creating journal:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
