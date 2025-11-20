"use client";

import { format, parseISO } from "date-fns";
import { Heart, Moon, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { DailyProgress } from "@/types/database.types";

interface ProgressHistoryProps {
  progressRecords: DailyProgress[];
}

// Mood emoji mapping
const moodEmojis: Record<string, string> = {
  great: "😄",
  good: "🙂",
  okay: "😐",
  bad: "☹️",
  terrible: "😢",
  happy: "😊",
  sad: "😔",
  anxious: "😰",
  calm: "😌",
};

// Sleep quality colors (dark mode optimized)
const sleepColors: Record<string, string> = {
  excellent: "bg-green-500/20 text-green-300 border-green-500/50",
  good: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  fair: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  poor: "bg-orange-500/20 text-orange-300 border-orange-500/50",
  terrible: "bg-red-500/20 text-red-300 border-red-500/50",
};

export function ProgressHistory({ progressRecords }: ProgressHistoryProps) {
  if (progressRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">No progress entries yet</p>
        <p className="text-sm text-muted-foreground">
          Start tracking your daily mood and wellness
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {progressRecords.map((progress) => {
          const createdDate = parseISO(progress.created_at);
          const moodEmoji = progress.mood
            ? moodEmojis[progress.mood.toLowerCase()] || "💭"
            : "💭";
          const sleepColorClass = progress.sleep
            ? sleepColors[progress.sleep.toLowerCase()] || "bg-gray-500/20 text-gray-300"
            : "bg-gray-500/20 text-gray-300";

          return (
            <div
              key={progress.id}
              className="p-4 rounded-lg border bg-card space-y-3"
            >
              {/* Date Header */}
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">
                  {format(createdDate, "EEEE, MMM d, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(createdDate, "h:mm a")}
                </div>
              </div>

              {/* Mood and Sleep */}
              <div className="flex flex-wrap gap-2">
                {progress.mood && (
                  <Badge variant="outline" className="capitalize">
                    <Heart className="h-3 w-3 mr-1" />
                    <span>{moodEmoji}</span>
                    <span className="ml-1">{progress.mood}</span>
                  </Badge>
                )}
                {progress.sleep && (
                  <Badge variant="outline" className={`capitalize ${sleepColorClass}`}>
                    <Moon className="h-3 w-3 mr-1" />
                    {progress.sleep}
                  </Badge>
                )}
              </div>

              {/* Gratefulness */}
              {progress.gratefulness && progress.gratefulness.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 text-xs font-medium mb-2 text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    <span>Grateful for:</span>
                  </div>
                  <ul className="space-y-1 pl-4">
                    {progress.gratefulness.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground list-disc"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

