import { createFileRoute } from "@tanstack/react-router";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { LEADERBOARD, SUBJECT } from "@/data/medContent";
import { useMedStore } from "@/lib/medStore";
import { Crown, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Classifica settimanale — MedRep" },
      { name: "description", content: "Sfida i tuoi colleghi di facoltà nella classifica XP settimanale." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { state } = useMedStore();
  const me = { name: "Tu", xp: state.weeklyXp, avatar: "🧑‍🎓", isMe: true };
  const merged = [...LEADERBOARD.map((u) => ({ ...u, isMe: false })), me]
    .sort((a, b) => b.xp - a.xp)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-warning to-warning/60 text-warning-foreground p-5 node-shadow mb-6 text-center">
          <Trophy className="size-10 mx-auto mb-1" />
          <h1 className="text-2xl font-extrabold">Classifica settimanale</h1>
          <p className="text-sm opacity-90">{SUBJECT.faculty}</p>
          <div className="mt-2 text-xs font-extrabold opacity-80">Si resetta ogni lunedì</div>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-2 items-end mb-6">
          {[merged[1], merged[0], merged[2]].map((u, idx) => {
            const heights = ["h-20", "h-28", "h-16"];
            const colors = ["bg-muted-foreground/30", "bg-warning", "bg-streak/60"];
            const icons = [<Medal key="2" className="size-5" />, <Crown key="1" className="size-6" />, <Medal key="3" className="size-5" />];
            return (
              <div key={u.rank} className="flex flex-col items-center">
                <div className="text-3xl mb-1">{u.avatar}</div>
                <div className={cn("text-xs font-extrabold truncate max-w-full", u.isMe && "text-primary")}>{u.name}</div>
                <div className="text-[10px] text-muted-foreground font-bold">{u.xp} XP</div>
                <div className={cn("w-full mt-1 rounded-t-2xl text-white grid place-items-center", colors[idx], heights[idx])}>
                  {icons[idx]}
                  <div className="font-extrabold">{u.rank}</div>
                </div>
              </div>
            );
          })}
        </div>

        <ul className="space-y-2">
          {merged.slice(3).map((u) => (
            <li
              key={u.name + u.rank}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 p-3",
                u.isMe ? "border-primary bg-primary/10" : "border-border bg-card"
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
      </main>
      <BottomNav />
    </div>
  );
}
