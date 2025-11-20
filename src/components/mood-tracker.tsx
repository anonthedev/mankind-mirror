"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Smile } from "lucide-react";

const MOODS = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😡", label: "Angry", value: "angry" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
];

interface MoodTrackerProps {
  userId: string;
  mode?: "default" | "sidebar";
}

export function MoodTracker({ userId, mode = "default" }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isRecorded, setIsRecorded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if mood already recorded today
    async function checkTodayMood() {
      try {
        const response = await fetch("/api/mood/today");
        const data = await response.json();
        if (data.mood) {
          setSelectedMood(data.mood);
          setIsRecorded(true);
        }
      } catch (error) {
        console.error("Error checking today's mood:", error);
      }
    }
    checkTodayMood();
  }, []);

  const handleMoodSelect = async (moodValue: string) => {
    if (isRecorded) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodValue }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedMood(moodValue);
        setIsRecorded(true);
        setOpen(false);
        toast.success("Mood recorded! Streak updated.");
        // Refresh the page to update streak count
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to record mood");
      }
    } catch (error) {
      toast.error("Failed to record mood");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentMoodEmoji = () => {
    if (!selectedMood) return "😊";
    const mood = MOODS.find((m) => m.value === selectedMood);
    return mood?.emoji || "😊";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {mode === "sidebar" ? (
            <SidebarMenuButton tooltip={isRecorded ? "Mood Recorded" : "Track Mood"}>
                {isRecorded && selectedMood ? (
                    <span className="flex items-center justify-center text-lg leading-none size-4 select-none grayscale-0">
                        {getCurrentMoodEmoji()}
                    </span>
                ) : (
                    <Smile />
                )}
                <span>{isRecorded ? "Mood Recorded" : "Mood Tracker"}</span>
            </SidebarMenuButton>
        ) : (
            <Button
            variant="ghost"
            size="lg"
            className="text-2xl p-2"
            disabled={isRecorded}
            >
            {getCurrentMoodEmoji()}
            </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-center">
            {isRecorded ? "Today's mood" : "How are you feeling today?"}
          </p>
          <div className="flex gap-2">
            {MOODS.map((mood) => (
              <Button
                key={mood.value}
                variant="ghost"
                size="lg"
                className="text-3xl p-3 hover:scale-110 transition-transform"
                onClick={() => handleMoodSelect(mood.value)}
                disabled={isRecorded || isLoading}
                title={mood.label}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
          {isRecorded && (
            <p className="text-xs text-muted-foreground text-center">
              Come back tomorrow to track your mood again!
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SidebarMoodTracker({ userId }: { userId: string }) {
    return <MoodTracker userId={userId} mode="sidebar" />;
}
