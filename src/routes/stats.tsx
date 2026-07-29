import { createFileRoute } from "@tanstack/react-router";
import { NODES } from "@/data/medContent";
import { getNodeProgress, getOverallStats, nodeXp, useMedStore } from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { nodeTheme } from "@/lib/nodeTheme";
import { Flame, Gem, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Statistiche — MedRep" },
      { name: "description", content: "I tuoi progressi esame per esame." },
    ],
  }),
  component: StatsPage,
});

const SORTED_NODES = [...NODES].sort((a, b) => a.title.localeCompare(b.title, "it"));

function StatsPage() {
  const { state } = useMedStore();
  const overall = getOverallStats(state);

  return (
    <div className="min-h-screen pb-28 bg-background">
      <MedHeader />

      <main className="mx-auto max-w-md px-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Tile icon={<Gem className="size-5 text-gem" />} value={state.xp} label="XP totali" />
          <Tile
            icon={<Flame className="size-5 text-streak fill-streak" />}
            value={state.streak}
            label="Giorni di fila"
          />
          <Tile
            icon={<Target className="size-5 text-success" />}
            value={overall.levelsDone}
            label="Livelli fatti"
          />
        </div>

        <section>
          <h2 className="px-1 mb-2 text-sm font-extrabold text-foreground">
            I tuoi esami · {overall.nodesDone}/{overall.nodesTotal} completati
          </h2>
          <div className="rounded-2xl border bg-card p-3 soft-shadow space-y-3">
            {SORTED_NODES.map((node, i) => {
              const theme = nodeTheme(i);
              const done = Math.min(
                node.levels.length,
                getNodeProgress(state, node.id).completedLevels.length,
              );
              const pct = Math.round((done / node.levels.length) * 100);
              return (
                <div key={node.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid place-items-center size-9 rounded-xl text-lg shrink-0",
                      theme.tile,
                    )}
                  >
                    <span aria-hidden>{node.emoji}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-extrabold text-foreground truncate">
                        {node.title}
                      </span>
                      <span className="text-[11px] font-extrabold text-muted-foreground tabular-nums shrink-0">
                        {pct}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn("h-full rounded-full animate-bar-grow", theme.bar)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold text-muted-foreground tabular-nums">
                      {done}/{node.levels.length} livelli · {nodeXp(state, node.id)} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function Tile({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-3 soft-shadow text-center">
      <div className="grid place-items-center mb-1">{icon}</div>
      <div className="font-extrabold text-foreground tabular-nums leading-none">{value}</div>
      <div className="text-[10px] font-bold text-muted-foreground leading-tight mt-0.5">
        {label}
      </div>
    </div>
  );
}
