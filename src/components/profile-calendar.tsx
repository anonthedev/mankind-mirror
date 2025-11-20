"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { isSameDay, parseISO, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Journal, DailyProgress } from "@/types/database.types";

interface ProfileCalendarProps {
  journalDates: Date[];
  progressDates: Date[];
  journals: Journal[];
  progressRecords: DailyProgress[];
}

export function ProfileCalendar({
  journalDates,
  progressDates,
  journals,
  progressRecords,
}: ProfileCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get journals for selected date
  const selectedJournals = selectedDate
    ? journals.filter((j) =>
        isSameDay(parseISO(j.created_at), selectedDate)
      )
    : [];

  // Get progress for selected date
  const selectedProgress = selectedDate
    ? progressRecords.filter((p) =>
        isSameDay(parseISO(p.created_at), selectedDate)
      )
    : [];

  // Custom modifiers for the calendar (dark mode optimized)
  const modifiers = {
    hasJournal: journalDates,
    hasProgress: progressDates,
    hasActivity: [...journalDates, ...progressDates],
  };

  const modifiersClassNames = {
    hasJournal: "bg-blue-500/20 font-bold border-blue-500/50",
    hasProgress: "bg-green-500/20 font-bold border-green-500/50",
    hasActivity: "relative",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="shrink-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-md border"
        />
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </h3>

          {!selectedJournals.length && !selectedProgress.length && (
            <p className="text-muted-foreground text-sm">
              No activity on this date
            </p>
          )}

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {/* Journals for selected date */}
              {selectedJournals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                    <span>Journals ({selectedJournals.length})</span>
                  </div>
                  {selectedJournals.map((journal) => (
                    <Link
                      key={journal.id}
                      href={`/journals/${journal.id}`}
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">
                        {journal.title || "Untitled Journal"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(parseISO(journal.created_at), "h:mm a")}
                      </div>
                      {journal.content && (
                        <div 
                          className="text-sm text-muted-foreground mt-2 line-clamp-2 prose prose-sm dark:prose-invert max-w-none *:my-0"
                          dangerouslySetInnerHTML={{ 
                            __html: journal.content.substring(0, 150) + (journal.content.length > 150 ? "..." : "")
                          }}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Progress for selected date */}
              {selectedProgress.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Heart className="h-4 w-4 text-green-400" />
                    <span>Daily Progress</span>
                  </div>
                  {selectedProgress.map((progress) => (
                    <div
                      key={progress.id}
                      className="p-3 rounded-lg border bg-card"
                    >
                      <div className="flex flex-wrap gap-2 mb-2">
                        {progress.mood && (
                          <Badge variant="outline" className="capitalize">
                            Mood: {progress.mood}
                          </Badge>
                        )}
                        {progress.sleep && (
                          <Badge variant="outline" className="capitalize">
                            Sleep: {progress.sleep}
                          </Badge>
                        )}
                      </div>
                      {progress.gratefulness &&
                        progress.gratefulness.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-medium mb-1">
                              Grateful for:
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {progress.gratefulness.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {format(parseISO(progress.created_at), "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

