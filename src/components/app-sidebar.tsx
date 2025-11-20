import { createClient } from "@/utils/supabase/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Plus, Home, User, BookOpen, Flame, Trophy } from "lucide-react";
import { SidebarCreatePost } from "@/components/sidebar-create-post";
import { SidebarMoodTracker } from "@/components/mood-tracker";
import { SignOutButton } from "@/components/sign-out-button";

export async function AppSidebar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let journals: { id: string; title: string | null }[] = [];
  let userProfile = null;

  if (user) {
    const { data } = await supabase
      .from("journal")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    journals = data || [];

    const { data: profile } = await supabase
      .from("user_profile")
      .select("streak, points")
      .eq("user_id", user.id)
      .single();
    userProfile = profile;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">MankindMirror</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user && (
                <SidebarMenuItem>
                  <SidebarCreatePost />
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Create Journal">
                  <Link href="/journals/create">
                    <Plus />
                    <span>New Journal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user && (
                <SidebarMenuItem>
                  <SidebarMoodTracker userId={user.id} />
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Your Journals</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuButton asChild tooltip="Home">
                <Link href="/journals/chat">
                  <Home />
                  <span>Chat with yourself</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenu>
                {journals.map((journal) => (
                  <SidebarMenuItem key={journal.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={journal.title || "Untitled"}
                    >
                      <Link href={`/journals/${journal.id}`}>
                        <BookOpen />
                        <span>{journal.title || "Untitled Journal"}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {journals.length === 0 && (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    No journals yet
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {user && userProfile && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Stats"
                className="justify-between hover:bg-transparent hover:text-sidebar-foreground cursor-default"
              >
                <div className="flex items-center gap-2 text-orange-500">
                  <Flame className="size-4" />
                  <span className="font-medium">
                    {userProfile.streak || 0} Streak
                  </span>
                </div>
                <div className="flex items-center gap-2 text-yellow-500">
                  <Trophy className="size-4" />
                  <span className="font-medium">
                    {userProfile.points || 0} Pts
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            {user ? (
              <>
                <SidebarMenuButton asChild tooltip="Profile">
                  <Link href="/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuItem>
                  <SignOutButton />
                </SidebarMenuItem>
              </>
            ) : (
              <SidebarMenuButton asChild tooltip="Sign In">
                <Link href="/auth/sign-in">
                  <User />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
