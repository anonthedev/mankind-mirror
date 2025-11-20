"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JournalForm } from "@/components/journal-form";
import { Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import type { Journal } from "@/types/database.types";

interface JournalViewProps {
  journal: Journal;
}

export function JournalView({ journal }: JournalViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/journals/${journal.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Journal deleted successfully");
        router.push("/journals");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to delete journal");
      }
    } catch (error) {
      toast.error("Failed to delete journal");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Journal</h1>
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Mode
          </Button>
        </div>
        <JournalForm initialData={journal} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Created {format(new Date(journal.created_at), "PPpp")}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your journal entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{journal.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: journal.content || "" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
