import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NODES, isReviewNode } from "@/data/medContent";
import { getNodeProgress, isNodeCompleted, nodeXp, useMedStore } from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { Mascot } from "@/components/Mascot";
import { nodeTheme } from "@/lib/nodeTheme";
import { Check, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedRep — Materie di medicina, micro-apprendimento gamificato" },
      {
        name: "description",
        content:
          "Studia medicina esame per esame: scegli quale preparare, nell'ordine che vuoi.",
      },
      { property: "og:title", content: "MedRep — Studia medicina, un esame alla volta" },
      {
        property: "og:description",
        content:
          "Nessun obbligo di propedeuticità: scegli tu quale esame preparare, come in università.",
      },
    ],
  }),
  component: HomePage,
});

const SORTED_NODES = [...NODES].sort((a, b) => a.title.localeCompare(b.title, "it"));

function HomePage() {
  const { state } = useMedStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SORTED_NODES;
    return SORTED_NODES.filter((n) => n.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen pb-28 bg-background">
      <MedHeader />

      <main className="mx-auto max-w-md px-4 pb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un esame…"
            className="w-full rounded-2xl border bg-card pl-10 pr-4 py-2.5 text-sm font-bold text-foreground placeholder:text-muted-foreground placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <ol className="space-y-2.5">
          {filtered.map((node) => {
            const i = SORTED_NODES.indexOf(node);
            const theme = nodeTheme(i);
            const progress = getNodeProgress(state, node.id);
            const done = isNodeCompleted(state, node.id);
            const review = isReviewNode(node);
            return (
              <li key={node.id}>
                <Link
                  to="/node/$nodeId"
                  params={{ nodeId: node.id }}
                  className="flex items-center gap-3 rounded-2xl border bg-card px-3 py-3 soft-shadow active:scale-[0.99] transition"
                >
                  <span
                    className={cn(
                      "grid place-items-center size-12 rounded-2xl text-2xl shrink-0",
                      theme.tile,
                    )}
                  >
                    <span aria-hidden>{node.emoji}</span>
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block font-extrabold text-foreground leading-tight line-clamp-2">
                      {node.title}
                    </span>
                    <span className="mt-1 flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
                      <span className="tabular-nums">
                        {progress.completedLevels.length}/{node.levels.length} livelli
                      </span>
                      <span className="tabular-nums">{nodeXp(state, node.id)} XP</span>
                      {review && (
                        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
                          Ripasso
                        </span>
                      )}
                    </span>
                  </span>

                  {done ? (
                    <span className="grid place-items-center size-7 rounded-full bg-success text-success-foreground shrink-0">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                  ) : (
                    <ChevronRight className="size-5 text-muted-foreground shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="py-10 text-center text-sm font-bold text-muted-foreground">
              Nessun esame trovato.
            </li>
          )}
        </ol>

        <DailyQuizCard />
      </main>

      <BottomNav />
    </div>
  );
}

function DailyQuizCard() {
  return (
    <Link
      to="/quiz"
      className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-3 py-3 soft-shadow active:scale-[0.99] transition"
    >
      <Mascot pose="cheer" className="size-14 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-foreground leading-tight">Quiz del giorno</div>
        <div className="text-xs font-bold text-muted-foreground leading-tight">
          Metti alla prova le tue conoscenze!
        </div>
      </div>
      <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground shrink-0">
        +20 XP
      </span>
      <ChevronRight className="size-5 text-primary shrink-0" />
    </Link>
  );
}
