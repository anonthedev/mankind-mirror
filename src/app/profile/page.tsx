import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Calendar as CalendarIcon, BookOpen, Heart, Sparkles } from "lucide-react";
import { format, parseISO, startOfDay } from "date-fns";
import { ProfileCalendar } from "@/components/profile-calendar";
import { JournalsList } from "@/components/journals-list";
import { ProgressHistory } from "@/components/progress-history";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("user_profile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch all journals
  const { data: journals } = await supabase
    .from("journal")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch all progress records
  const { data: progressRecords } = await supabase
    .from("daily_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate stats
  const totalJournals = journals?.length || 0;
  const totalProgress = progressRecords?.length || 0;
  const streak = profile?.streak || 0;
  const points = profile?.points || 0;

  // Get dates with journals
  const journalDates = journals?.map(j => startOfDay(parseISO(j.created_at))) || [];
  
  // Get dates with progress
  const progressDates = progressRecords?.map(p => startOfDay(parseISO(p.created_at))) || [];

  // Get user initials
  const email = user.email || "";
  const initials = email
    .split("@")[0]
    .split(".")
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
    .substring(0, 2) || "U";

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-primary to-primary/60">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold">{email.split("@")[0]}</h1>
          <p className="text-muted-foreground">{email}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 text-orange-400 border-orange-500/50 bg-orange-500/10">
              <Flame className="size-4" />
              <span className="font-semibold">{streak} Day Streak</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 text-yellow-400 border-yellow-500/50 bg-yellow-500/10">
              <Trophy className="size-4" />
              <span className="font-semibold">{points} Points</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Journals</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{totalJournals}</div>
            <p className="text-xs text-muted-foreground">
              Your thoughts recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Entries</CardTitle>
            <Heart className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{totalProgress}</div>
            <p className="text-xs text-muted-foreground">
              Days of mood tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <CalendarIcon className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {format(parseISO(profile?.created_at || user.created_at), "MMM yyyy")}
            </div>
            <p className="text-xs text-muted-foreground">
              Journey started
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Activity Calendar
          </CardTitle>
          <CardDescription>
            Days with journals and progress entries are highlighted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileCalendar 
            journalDates={journalDates}
            progressDates={progressDates}
            journals={journals || []}
            progressRecords={progressRecords || []}
          />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Journals List */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Your Journals
            </CardTitle>
            <CardDescription>
              Click on any journal to view it
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <JournalsList journals={journals || []} />
          </CardContent>
        </Card>

        {/* Progress History */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Progress History
            </CardTitle>
            <CardDescription>
              Your mood and wellness tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ProgressHistory progressRecords={progressRecords || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

