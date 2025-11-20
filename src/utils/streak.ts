import { createClient } from "@/utils/supabase/server";
import type { Mood } from "@/types/database.types";

/**
 * Calculate the mood streak for a user
 * A streak is maintained if the user has recorded a mood for consecutive days
 */
export async function calculateMoodStreak(userId: string): Promise<number> {
  const supabase = await createClient();

  // Fetch all mood entries for the user, ordered by date descending
  const { data: moods, error } = await supabase
    .from("mood")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !moods || moods.length === 0) {
    return 0;
  }

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's a mood entry for today or yesterday
  // We use the most recent entry to start the check
  const mostRecentDate = new Date(moods[0].created_at);
  mostRecentDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

  // If the most recent entry is more than 1 day old (e.g. 2 days ago), streak is broken/reset.
  // However, since we calculate streak based on history, if the user just recorded a mood (today),
  // daysDiff should be 0.
  if (daysDiff > 1) {
    return 0;
  }

  // Count consecutive days
  const moodDates = moods.map(m => {
    const d = new Date(m.created_at);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  // Remove duplicates (same day entries)
  const uniqueDates = [...new Set(moodDates)].sort((a, b) => b - a);

  streak = 1; // Count the first entry
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const previousDate = uniqueDates[i - 1];
    const diff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Check if user has already recorded mood today
 */
export async function hasMoodToday(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("mood")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString())
    .limit(1);

  return !error && data && data.length > 0;
}

/**
 * Get today's mood for a user
 */
export async function getTodayMood(userId: string): Promise<string | null> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("mood")
    .select("mood")
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString())
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data.mood;
}

/**
 * Record a mood and update streak
 */
export async function recordMood(userId: string, mood: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Check if mood already recorded today
  const hasToday = await hasMoodToday(userId);
  if (hasToday) {
    return { success: false, error: "Mood already recorded for today" };
  }

  // Insert mood entry
  const { error: insertError } = await supabase
    .from("mood")
    .insert({ user_id: userId, mood });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Calculate new streak
  const newStreak = await calculateMoodStreak(userId);

  // Update or Insert user profile with new streak
  // We use upsert to handle cases where the profile might not exist yet
  const { error: updateError } = await supabase
    .from("user_profile")
    .upsert(
        { user_id: userId, streak: newStreak },
        { onConflict: "user_id" }
    );

  if (updateError) {
    // Don't fail the whole request if streak update fails, but log it
    console.error("Failed to update streak:", updateError);
    // return { success: false, error: updateError.message };
  }

  return { success: true };
}
