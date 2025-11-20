"use client";

import { Button } from "@/components/ui/button";
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
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 px-2"
      onClick={handleSignOut}
    >
      <LogOut className="size-4" />
      <span>Sign Out</span>
    </Button>
  );
}

