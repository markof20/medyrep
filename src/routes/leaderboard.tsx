import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUBJECT } from "@/data/medContent";
import { useAuth } from "@/lib/useAuth";
import { supabase, supabaseEnabled } from "@/lib/supabaseClient";
import { Crown, Medal, Trophy, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Classifica settimanale — MedRep" },
      {
        name: "description",
        content: "Sfida i tuoi colleghi di facoltà nella classifica XP settimanale.",
      },
    ],
  }),
  component: LeaderboardPage,
});

type Entry = { id: string; name: string; xp: number; avatar: string; isMe: boolean };

async function fetchGlobal(myId: string): Promise<Entry[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_emoji, weekly_xp")
    .order("weekly_xp", { ascending: false })
    .limit(50);
  return (data ?? []).map((u) => ({
    id: u.id,
    name: u.display_name,
    xp: u.weekly_xp,
    avatar: u.avatar_emoji,
    isMe: u.id === myId,
  }));
}

async function fetchFriendsBoard(myId: string): Promise<Entry[]> {
  if (!supabase) return [];
  type FriendProfile = { id: string; display_name: string; avatar_emoji: string; weekly_xp: number };
  const [me, a, b] = await Promise.all([
    supabase.from("profiles").select("id, display_name, avatar_emoji, weekly_xp").eq("id", myId).single(),
    supabase
      .from("friendships")
      .select("profiles!friendships_friend_id_fkey(id, display_name, avatar_emoji, weekly_xp)")
      .eq("user_id", myId)
      .eq("status", "accepted"),
    supabase
      .from("friendships")
      .select("profiles!friendships_user_id_fkey(id, display_name, avatar_emoji, weekly_xp)")
      .eq("friend_id", myId)
      .eq("status", "accepted"),
  ]);
  const friends = [...(a.data ?? []), ...(b.data ?? [])] as unknown as { profiles: FriendProfile | null }[];
  const friendProfiles = friends.map((f) => f.profiles).filter((p): p is FriendProfile => p !== null);
  const rows: FriendProfile[] = me.data ? [me.data, ...friendProfiles] : friendProfiles;
  return rows.map((u) => ({
    id: u.id,
    name: u.display_name,
    xp: u.weekly_xp,
    avatar: u.avatar_emoji,
    isMe: u.id === myId,
  }));
}

function rank(entries: Entry[]) {
  return [...entries].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
}

function LeaderboardPage() {
  const { session, signInWithGoogle } = useAuth();
  const myId = session?.user.id;

  const globalQuery = useQuery({
    queryKey: ["leaderboard-global", myId],
    queryFn: () => fetchGlobal(myId!),
    enabled: Boolean(myId),
  });
  const friendsQuery = useQuery({
    queryKey: ["leaderboard-friends", myId],
    queryFn: () => fetchFriendsBoard(myId!),
    enabled: Boolean(myId),
  });

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-warning to-warning/60 text-warning-foreground p-5 node-shadow mb-6 text-center">
          <Trophy className="size-10 mx-auto mb-1" />
          <h1 className="text-2xl font-extrabold">Classifica</h1>
          <p className="text-sm opacity-90">{SUBJECT.faculty}</p>
        </div>

        {!supabaseEnabled || !myId ? (
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Accedi con Google per vedere la classifica reale e sfidare i tuoi amici.
            </p>
            {supabaseEnabled && (
              <Button className="font-extrabold" onClick={signInWithGoogle}>
                <LogIn className="size-4" /> Accedi con Google
              </Button>
            )}
          </div>
        ) : (
          <Tabs defaultValue="global">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="global">Globale</TabsTrigger>
              <TabsTrigger value="friends">Amici</TabsTrigger>
            </TabsList>
            <TabsContent value="global">
              <Board entries={rank(globalQuery.data ?? [])} loading={globalQuery.isLoading} />
            </TabsContent>
            <TabsContent value="friends">
              <Board
                entries={rank(friendsQuery.data ?? [])}
                loading={friendsQuery.isLoading}
                emptyHint="Aggiungi amici dalla pagina Amici per vederli qui."
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function Board({
  entries,
  loading,
  emptyHint,
}: {
  entries: (Entry & { rank: number })[];
  loading: boolean;
  emptyHint?: string;
}) {
  if (loading) {
    return <div className="text-center text-sm text-muted-foreground py-8">Caricamento…</div>;
  }
  if (entries.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        {emptyHint ?? "Nessun dato disponibile."}
      </div>
    );
  }

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 items-end mb-6">
        {[podium[1], podium[0], podium[2]].map((u, idx) => {
          if (!u) return <div key={idx} />;
          const heights = ["h-20", "h-28", "h-16"];
          const colors = ["bg-muted-foreground/30", "bg-warning", "bg-streak/60"];
          const icons = [
            <Medal key="2" className="size-5" />,
            <Crown key="1" className="size-6" />,
            <Medal key="3" className="size-5" />,
          ];
          return (
            <div key={u.id} className="flex flex-col items-center">
              <div className="text-3xl mb-1">{u.avatar}</div>
              <div
                className={cn(
                  "text-xs font-extrabold truncate max-w-full",
                  u.isMe && "text-primary",
                )}
              >
                {u.name}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold">{u.xp} XP</div>
              <div
                className={cn(
                  "w-full mt-1 rounded-t-2xl text-white grid place-items-center",
                  colors[idx],
                  heights[idx],
                )}
              >
                {icons[idx]}
                <div className="font-extrabold">{u.rank}</div>
              </div>
            </div>
          );
        })}
      </div>

      <ul className="space-y-2">
        {rest.map((u) => (
          <li
            key={u.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 p-3",
              u.isMe ? "border-primary bg-primary/10" : "border-border bg-card",
            )}
          >
            <div className="size-8 grid place-items-center rounded-full bg-secondary font-extrabold text-sm">
              {u.rank}
            </div>
            <div className="text-2xl">{u.avatar}</div>
            <div className="flex-1 font-extrabold">{u.name}</div>
            <div className="flex items-center gap-1 text-warning-foreground bg-warning/20 px-2 py-1 rounded-full">
              <span className="text-xs font-extrabold">{u.xp} XP</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
