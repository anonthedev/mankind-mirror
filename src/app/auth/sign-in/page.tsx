import { SignInButton } from "@/components/sign-in-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle>Welcome to MankindMirror</CardTitle>
          <CardDescription>Sign in to start your journey</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground mb-4">
            Join our community of men supporting men. Track your mood, journal your thoughts, and grow together.
          </div>
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

