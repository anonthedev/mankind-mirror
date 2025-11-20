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
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Journal</h1>
        <JournalForm />
      </div>
    </div>
  );
}

