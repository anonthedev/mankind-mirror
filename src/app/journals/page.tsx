import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function JournalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch user's journals
  const { data: journals } = await supabase
    .from("journal")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Journals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            {journals && journals.length > 0 ? (
              <p>
                Select a journal from the sidebar to view or edit, or create a
                new one.
              </p>
            ) : (
              <p>
                You haven't created any journals yet. Click "Create Journal" to
                get started!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

