"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? "Signing in..." : "Sign In with Google"}
    </Button>
  );
}

