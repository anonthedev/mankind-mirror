"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./editor-toolbar";

interface JournalFormProps {
  initialData?: {
    id: string;
    title: string | null;
    content: string | null;
  };
}

export function JournalForm({ initialData }: JournalFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What's on your mind today?",
      }),
    ],
    content: initialData?.content || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none",
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!editor || editor.isEmpty) {
      toast.error("Please write some content");
      return;
    }

    setIsLoading(true);
    try {
      const url = initialData
        ? `/api/journals/${initialData.id}`
        : "/api/journals";
      const method = initialData ? "PUT" : "POST";

      // Get HTML content from editor
      const content = editor.getHTML();

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          initialData
            ? "Journal updated successfully!"
            : "Journal created! +10 points"
        );
        router.push(`/journals/${data.id}`);
        router.refresh();
      } else {
        toast.error(data.error || "Failed to save journal");
      }
    } catch (error) {
      toast.error("Failed to save journal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">
          {initialData ? "Edit Journal" : "Write Your Thoughts"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Give your journal a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-lg py-6"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <Label>Content</Label>
          <div className="flex flex-col gap-2 flex-1">
            <EditorToolbar editor={editor} />
            <div className="flex-1 min-h-[400px] border rounded-md p-2">
              <EditorContent editor={editor} className="h-full" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
