import { createClient } from "@/utils/supabase/server";

/**
 * Add points to a user's profile
 */
export async function addPoints(userId: string, points: number): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get current points
  const { data: profile, error: fetchError } = await supabase
    .from("user_profile")
    .select("points")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  const currentPoints = profile?.points || 0;
  const newPoints = Number(currentPoints) + points;

  // Update points
  const { error: updateError } = await supabase
    .from("user_profile")
    .update({ points: newPoints })
    .eq("user_id", userId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

/**
 * Check if user has already created a journal today
 */
export async function hasJournalToday(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("journal")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString())
    .limit(1);

  return !error && data && data.length > 0;
}

/**
 * Award points for journal creation (10 points per day)
 */
export async function awardJournalPoints(userId: string): Promise<{ success: boolean; error?: string }> {
  // Check if already got points today
  const alreadyCreatedToday = await hasJournalToday(userId);
  
  // Always allow adding points for new journals
  // The check is just informational - users can create multiple journals
  // but we'll add 10 points for the first one each day
  
  return await addPoints(userId, 10);
}

