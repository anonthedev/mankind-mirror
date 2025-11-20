"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ModerationErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export function ModerationErrorModal({
  open,
  onOpenChange,
  message,
}: ModerationErrorModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl">
              Content Flagged
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base leading-relaxed pt-2">
            {message}
          </AlertDialogDescription>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Community Guidelines:</strong>
              <br />
              Please ensure your message is supportive, respectful, and safe for
              all community members. We're here to help each other grow and heal.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="bg-primary hover:bg-primary/90"
          >
            Revise Message
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

