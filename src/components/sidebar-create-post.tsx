"use client";

import { useState } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { CreatePostModal } from "@/components/create-post-modal";
import { PenSquare } from "lucide-react";

export function SidebarCreatePost() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SidebarMenuButton onClick={() => setOpen(true)} tooltip="Create Post">
        <PenSquare />
        <span>Create Post</span>
      </SidebarMenuButton>
      <CreatePostModal open={open} onOpenChange={setOpen} />
    </>
  );
}

