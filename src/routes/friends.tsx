import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/useAuth";
import { supabase, supabaseEnabled } from "@/lib/supabaseClient";
import { Search, UserPlus, Check, X, UserMinus } from "lucide-react";

export const Route = createFileRoute("/friends")({
  head: () => ({ meta: [{ title: "Amici — MedRep" }] }),
  component: FriendsPage,
});

type SearchResult = { id: string; display_name: string; avatar_emoji: string; xp: number };
type PendingRequest = {
  user_id: string;
  profiles: { display_name: string; avatar_emoji: string } | null;
};
type FriendRow = {
  id: string;
  display_name: string;
  avatar_emoji: string;
  xp: number;
};

async function fetchIncomingRequests(myId: string): Promise<PendingRequest[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("friendships")
    .select("user_id, profiles!friendships_user_id_fkey(display_name, avatar_emoji)")
    .eq("friend_id", myId)
    .eq("status", "pending");
  return (data as unknown as PendingRequest[]) ?? [];
}

async function fetchFriends(myId: string): Promise<FriendRow[]> {
  if (!supabase) return [];
  const [a, b] = await Promise.all([
    supabase
      .from("friendships")
      .select("profiles!friendships_friend_id_fkey(id, display_name, avatar_emoji, xp)")
      .eq("user_id", myId)
      .eq("status", "accepted"),
    supabase
      .from("friendships")
      .select("profiles!friendships_user_id_fkey(id, display_name, avatar_emoji, xp)")
      .eq("friend_id", myId)
      .eq("status", "accepted"),
  ]);
  const rows = [...(a.data ?? []), ...(b.data ?? [])] as unknown as { profiles: FriendRow | null }[];
  return rows
    .map((r) => r.profiles)
    .filter((p): p is FriendRow => p !== null)
    .sort((x, y) => y.xp - x.xp);
}

function FriendsPage() {
  const { session } = useAuth();
  const myId = session?.user.id;
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  const requestsQuery = useQuery({
    queryKey: ["friend-requests", myId],
    queryFn: () => fetchIncomingRequests(myId!),
    enabled: Boolean(myId),
  });

  const friendsQuery = useQuery({
    queryKey: ["friends", myId],
    queryFn: () => fetchFriends(myId!),
    enabled: Boolean(myId),
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["friend-requests", myId] });
    queryClient.invalidateQueries({ queryKey: ["friends", myId] });
  };

  async function runSearch() {
    if (!supabase || !myId || !query.trim()) return;
    setSearching(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_emoji, xp")
        .ilike("display_name", `%${query.trim()}%`)
        .neq("id", myId)
        .limit(20);
      setResults((data as SearchResult[]) ?? []);
    } catch {
      toast.error("Errore durante la ricerca");
    } finally {
      setSearching(false);
    }
  }

  async function sendRequest(otherId: string) {
    if (!supabase || !myId) return;
    const { data: existing } = await supabase
      .from("friendships")
      .select("user_id, friend_id, status")
      .or(
        `and(user_id.eq.${myId},friend_id.eq.${otherId}),and(user_id.eq.${otherId},friend_id.eq.${myId})`,
      )
      .maybeSingle();

    if (existing?.status === "accepted") {
      toast.info("Siete già amici");
      return;
    }
    if (existing?.status === "pending" && existing.user_id === otherId) {
      await acceptRequest(otherId);
      return;
    }
    if (existing?.status === "pending") {
      toast.info("Richiesta già inviata");
      return;
    }

    const { error } = await supabase
      .from("friendships")
      .insert({ user_id: myId, friend_id: otherId, status: "pending" });
    if (error) toast.error("Impossibile inviare la richiesta");
    else toast.success("Richiesta inviata");
  }

  async function acceptRequest(senderId: string) {
    if (!supabase || !myId) return;
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("user_id", senderId)
      .eq("friend_id", myId);
    if (error) toast.error("Impossibile accettare la richiesta");
    else {
      toast.success("Nuovo amico aggiunto");
      invalidateAll();
    }
  }

  async function rejectRequest(senderId: string) {
    if (!supabase || !myId) return;
    await supabase.from("friendships").delete().eq("user_id", senderId).eq("friend_id", myId);
    invalidateAll();
  }

  async function removeFriend(otherId: string) {
    if (!supabase || !myId) return;
    await supabase
      .from("friendships")
      .delete()
      .or(
        `and(user_id.eq.${myId},friend_id.eq.${otherId}),and(user_id.eq.${otherId},friend_id.eq.${myId})`,
      );
    invalidateAll();
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4 space-y-6">
        {!supabaseEnabled ? (
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-center text-sm text-muted-foreground">
            Login non configurato.
          </div>
        ) : !myId ? (
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-center text-sm text-muted-foreground">
            Accedi con Google dal tuo profilo per aggiungere amici.
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-xl font-extrabold mb-2">Trova amici</h1>
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Cerca per nome…"
                />
                <Button onClick={runSearch} disabled={searching}>
                  <Search className="size-4" />
                </Button>
              </div>
              {results !== null && (
                <ul className="mt-3 space-y-2">
                  {results.length === 0 && (
                    <li className="text-sm text-muted-foreground">Nessun risultato.</li>
                  )}
                  {results.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3"
                    >
                      <div className="text-2xl">{u.avatar_emoji}</div>
                      <div className="flex-1 font-extrabold">{u.display_name}</div>
                      <Button size="sm" variant="secondary" onClick={() => sendRequest(u.id)}>
                        <UserPlus className="size-4" /> Aggiungi
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {(requestsQuery.data?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-sm font-extrabold text-muted-foreground mb-2">
                  Richieste in arrivo
                </h2>
                <ul className="space-y-2">
                  {requestsQuery.data!.map((r) => (
                    <li
                      key={r.user_id}
                      className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3"
                    >
                      <div className="text-2xl">{r.profiles?.avatar_emoji}</div>
                      <div className="flex-1 font-extrabold">{r.profiles?.display_name}</div>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => acceptRequest(r.user_id)}
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => rejectRequest(r.user_id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="text-sm font-extrabold text-muted-foreground mb-2">
                I tuoi amici ({friendsQuery.data?.length ?? 0})
              </h2>
              <ul className="space-y-2">
                {friendsQuery.data?.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    Nessun amico ancora. Cercane uno qui sopra!
                  </li>
                )}
                {friendsQuery.data?.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3"
                  >
                    <div className="text-2xl">{f.avatar_emoji}</div>
                    <div className="flex-1 font-extrabold">{f.display_name}</div>
                    <div className="text-xs font-extrabold text-warning-foreground bg-warning/20 px-2 py-1 rounded-full">
                      {f.xp} XP
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeFriend(f.id)}>
                      <UserMinus className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
