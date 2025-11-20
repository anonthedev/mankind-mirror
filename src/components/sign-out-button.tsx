"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <SidebarMenuButton
      tooltip="Sign Out"
      onClick={handleSignOut}
    >
      <LogOut />
      <span>Sign Out</span>
    </SidebarMenuButton>
  );
}

