"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Smile, Loader2 } from "lucide-react";

const MOODS = [
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😡", label: "Angry", value: "angry" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😊", label: "Happy", value: "happy" },
];

const SLEEP_QUALITY = [
    { emoji: "🌑", label: "Bad", value: "bad" },
    { emoji: "🌘", label: "Poor", value: "poor" },
    { emoji: "🌗", label: "Okay", value: "okay" },
    { emoji: "🌖", label: "Good", value: "good" },
    { emoji: "🌕", label: "Great", value: "great" },
];

interface MoodTrackerProps {
  userId: string;
  mode?: "default" | "sidebar";
}

export function MoodTracker({ userId, mode = "default" }: MoodTrackerProps) {
  const [mood, setMood] = useState<string>("neutral");
  const [sleep, setSleep] = useState<string>("okay");
  const [gratefulness, setGratefulness] = useState<string[]>(["", "", ""]);
  const [isRecorded, setIsRecorded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if mood already recorded today
    async function checkTodayProgress() {
      try {
        const response = await fetch("/api/mood/today");
        const data = await response.json();
        if (data.mood) {
           // data.mood is the DailyProgress object
          setMood(data.mood.mood || "neutral");
          setSleep(data.mood.sleep || "okay");
          if (data.mood.gratefulness) {
              setGratefulness(data.mood.gratefulness);
          }
          setIsRecorded(true);
        }
      } catch (error) {
        console.error("Error checking today's progress:", error);
      } finally {
        setIsFetching(false);
      }
    }
    checkTodayProgress();
  }, [open]);

  const handleSubmit = async () => {
    if (!mood || !sleep || gratefulness.some(g => !g.trim())) {
        toast.error("Please fill in all fields");
        return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, sleep, gratefulness }),
      });

      const data = await response.json();

      if (data.success) {
        setIsRecorded(true);
        setOpen(false);
        toast.success("Progress recorded! Streak updated.");
        // Refresh the page to update streak count
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to record progress");
      }
    } catch (error) {
      toast.error("Failed to record progress");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentMoodEmoji = () => {
    const m = MOODS.find((m) => m.value === mood);
    return m?.emoji || "😊";
  };
  
  const getMoodIndex = () => {
    const idx = MOODS.findIndex(m => m.value === mood);
    return idx >= 0 ? idx : 3; // Default to neutral (index 3 in new array)
  };

  const getSleepIndex = () => {
    const idx = SLEEP_QUALITY.findIndex(s => s.value === sleep);
    return idx >= 0 ? idx : 2; // Default to okay (index 2)
  };

  const handleMoodSliderChange = (value: number[]) => {
      if (isRecorded) return;
      const index = value[0];
      if (index >= 0 && index < MOODS.length) {
          setMood(MOODS[index].value);
      }
  };

  const handleSleepSliderChange = (value: number[]) => {
      if (isRecorded) return;
      const index = value[0];
      if (index >= 0 && index < SLEEP_QUALITY.length) {
          setSleep(SLEEP_QUALITY[index].value);
      }
  };

  const currentMoodObj = MOODS.find(m => m.value === mood) || MOODS[3];
  const currentSleepObj = SLEEP_QUALITY.find(s => s.value === sleep) || SLEEP_QUALITY[2];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "sidebar" ? (
            <SidebarMenuButton tooltip={isRecorded ? "Daily Progress Recorded" : "Track Daily Progress"}>
                {isRecorded ? (
                    <span className="flex items-center justify-center text-lg leading-none size-4 select-none grayscale-0">
                        {getCurrentMoodEmoji()}
                    </span>
                ) : (
                    <Smile />
                )}
                <span>{isRecorded ? "Progress Recorded" : "Daily Check-in"}</span>
            </SidebarMenuButton>
        ) : (
            <Button
            variant="ghost"
            size="lg"
            className="text-2xl p-2"
            >
            {getCurrentMoodEmoji()}
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRecorded ? "Today's Progress" : "Daily Check-in"}</DialogTitle>
          <DialogDescription>
            {isRecorded ? "Here is what you recorded today." : "Track your mood, sleep, and gratefulness."}
          </DialogDescription>
        </DialogHeader>
        
        {isFetching ? (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <div className="grid gap-8 py-4">
            
            {/* Mood Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base">Mood</Label>
                    <div className="flex flex-col items-end">
                        <span className="text-4xl mb-1">{currentMoodObj.emoji}</span>
                        <span className="text-sm font-medium text-muted-foreground">{currentMoodObj.label}</span>
                    </div>
                </div>
                <Slider
                    defaultValue={[getMoodIndex()]}
                    value={[getMoodIndex()]}
                    max={4}
                    step={1}
                    onValueChange={handleMoodSliderChange}
                    disabled={isRecorded || isLoading}
                    className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>Sad</span>
                    <span>Happy</span>
                </div>
            </div>

            {/* Sleep Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base">Sleep Quality</Label>
                    <div className="flex flex-col items-end">
                        <span className="text-4xl mb-1">{currentSleepObj.emoji}</span>
                        <span className="text-sm font-medium text-muted-foreground">{currentSleepObj.label}</span>
                    </div>
                </div>
                <Slider
                    defaultValue={[getSleepIndex()]}
                    value={[getSleepIndex()]}
                    max={4}
                    step={1}
                    onValueChange={handleSleepSliderChange}
                    disabled={isRecorded || isLoading}
                    className="py-4"
                />
                 <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>Bad</span>
                    <span>Great</span>
                </div>
            </div>

            {/* Gratefulness Section */}
            <div className="space-y-2">
                <Label className="text-base">I am grateful for...</Label>
                {gratefulness.map((text, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm w-4">{index + 1}.</span>
                        <Input 
                            value={text}
                            onChange={(e) => {
                                if (isRecorded) return;
                                const newGratefulness = [...gratefulness];
                                newGratefulness[index] = e.target.value;
                                setGratefulness(newGratefulness);
                            }}
                            placeholder={`Something you're grateful for`}
                            disabled={isRecorded || isLoading}
                        />
                    </div>
                ))}
            </div>

            </div>
        )}

        {!isRecorded && !isFetching && (
            <DialogFooter>
            <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Progress"}
            </Button>
            </DialogFooter>
        )}
        
        {isRecorded && !isFetching && (
             <p className="text-xs text-muted-foreground text-center mt-4">
                Great job tracking today! Come back tomorrow.
            </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SidebarMoodTracker({ userId }: { userId: string }) {
    return <MoodTracker userId={userId} mode="sidebar" />;
}