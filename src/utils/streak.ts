import { createClient } from "@/utils/supabase/server";
import type { DailyProgress } from "@/types/database.types";

/**
 * Calculate the streak for a user
 * A streak is maintained if the user has recorded daily progress for consecutive days
 */
export async function calculateMoodStreak(userId: string): Promise<number> {
  const supabase = await createClient();

  // Fetch all progress entries for the user, ordered by date descending
  const { data: progress, error } = await supabase
    .from("daily_progress")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !progress || progress.length === 0) {
    return 0;
  }

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's a progress entry for today or yesterday
  // We use the most recent entry to start the check
  const mostRecentDate = new Date(progress[0].created_at);
  mostRecentDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

  // If the most recent entry is more than 1 day old (e.g. 2 days ago), streak is broken/reset.
  // However, since we calculate streak based on history, if the user just recorded progress (today),
  // daysDiff should be 0.
  if (daysDiff > 1) {
    return 0;
  }

  // Count consecutive days
  const progressDates = progress.map(p => {
    const d = new Date(p.created_at);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  // Remove duplicates (same day entries)
  const uniqueDates = [...new Set(progressDates)].sort((a, b) => b - a);

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
 * Check if user has already recorded progress today
 */
export async function hasMoodToday(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("daily_progress")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString())
    .limit(1);

  return !error && data && data.length > 0;
}

/**
 * Get today's progress for a user
 */
export async function getTodayMood(userId: string): Promise<DailyProgress | null> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("daily_progress")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString())
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Record progress and update streak
 */
export async function recordMood(
  userId: string, 
  data: { mood: string; sleep: string; gratefulness: string[] }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Check if progress already recorded today
  const hasToday = await hasMoodToday(userId);
  if (hasToday) {
    return { success: false, error: "Progress already recorded for today" };
  }

  // Insert progress entry
  const { error: insertError } = await supabase
    .from("daily_progress")
    .insert({ 
      user_id: userId, 
      mood: data.mood,
      sleep: data.sleep,
      gratefulness: data.gratefulness
    });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Calculate new streak
  const newStreak = await calculateMoodStreak(userId);

  // Update or Insert user profile with new streak
  const { error: updateError } = await supabase
    .from("user_profile")
    .upsert(
        { user_id: userId, streak: newStreak },
        { onConflict: "user_id" }
    );

  if (updateError) {
    console.error("Failed to update streak:", updateError);
  }

  return { success: true };
}
