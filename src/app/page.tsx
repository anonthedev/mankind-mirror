import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default async function Home() {
  const supabase = await createClient();

  // Fetch all posts (public access)
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Feed</h1>
          <p className="text-muted-foreground">
            Anonymous thoughts and experiences shared by the community
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <p className="text-base whitespace-pre-wrap">{post.content}</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span>
                      Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No posts yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
