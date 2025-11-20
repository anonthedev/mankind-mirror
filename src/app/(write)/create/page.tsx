import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { JournalForm } from "@/components/journal-form";

export default async function CreateJournalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <JournalForm />
    </div>
  );
}

