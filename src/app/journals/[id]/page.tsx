import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { JournalView } from "@/components/journal-view";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch the specific journal
  const { data: journal, error } = await supabase
    .from("journal")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !journal) {
    notFound();
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <JournalView journal={journal} />
      </div>
    </div>
  );
}

