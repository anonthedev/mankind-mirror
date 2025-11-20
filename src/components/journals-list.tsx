"use client";

import { format, parseISO } from "date-fns";
import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Journal } from "@/types/database.types";

interface JournalsListProps {
  journals: Journal[];
}

export function JournalsList({ journals }: JournalsListProps) {
  if (journals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">No journals yet</p>
        <p className="text-sm text-muted-foreground">
          Start your journaling journey today
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-3">
        {journals.map((journal) => {
          const createdDate = parseISO(journal.created_at);
          
          return (
            <Link
              key={journal.id}
              href={`/journals/${journal.id}`}
              className="block group"
            >
              <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                    {journal.title || "Untitled Journal"}
                  </h3>
                  <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>

                {journal.content && (
                  <div 
                    className="text-sm text-muted-foreground line-clamp-2 mb-3 prose prose-sm dark:prose-invert max-w-none *:my-0"
                    dangerouslySetInnerHTML={{ 
                      __html: journal.content.substring(0, 150) + (journal.content.length > 150 ? "..." : "")
                    }}
                  />
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(createdDate, "MMM d, yyyy")}</span>
                  <span>•</span>
                  <span>{format(createdDate, "h:mm a")}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}

