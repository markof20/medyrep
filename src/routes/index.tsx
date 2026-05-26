import { createFileRoute, Link } from "@tanstack/react-router";
import { SUBJECTS, getNodesForSubject, LEVELS_PER_NODE } from "@/data/medContent";
import { isNodeCompleted, useMedStore, getNodeProgress } from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedRep — Materie di medicina, micro-apprendimento gamificato" },
      {
        name: "description",
        content:
          "Studia medicina materia per materia: 5 materie, 20 nodi per materia, 5 livelli per nodo. Quiz, casi clinici, XP e streak.",
      },
      { property: "og:title", content: "MedRep — Studia medicina, livello per livello" },
      {
        property: "og:description",
        content: "Percorsi a nodi e livelli su più materie, con vite, XP e classifica globale.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state } = useMedStore();

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />

      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-5 node-shadow mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
            <Sparkles className="size-4" /> Le tue materie
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Scegli un percorso</h1>
          <p className="text-sm opacity-90 mt-1">
            5 materie · 20 nodi ciascuna · 5 livelli per nodo.
          </p>
        </div>

        <ul className="space-y-3">
          {SUBJECTS.map((s) => {
            const nodes = getNodesForSubject(s.id);
            const total = nodes.length;
            const completed = nodes.filter((n) => isNodeCompleted(state, n.id)).length;
            const totalLevels = nodes.reduce(
              (acc, n) =>
                acc + Math.min(LEVELS_PER_NODE, getNodeProgress(state, n.id).completedLevels.length),
              0,
            );
            const maxLevels = total * LEVELS_PER_NODE;
            const pct = maxLevels === 0 ? 0 : Math.round((totalLevels / maxLevels) * 100);
            return (
              <li key={s.id}>
                <Link
                  to="/subject/$subjectId"
                  params={{ subjectId: s.id }}
                  className="block"
                >
                  <div
                    className={cn(
                      "relative w-full rounded-3xl border-2 bg-card p-4 node-shadow flex items-center gap-4 transition",
                      "hover:-translate-y-0.5 active:translate-y-0.5",
                    )}
                  >
                    <div
                      className={cn(
                        "grid place-items-center size-14 rounded-2xl text-3xl shrink-0 bg-gradient-to-br text-primary-foreground",
                        s.gradient,
                      )}
                    >
                      <span>{s.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-foreground leading-tight truncate">
                        {s.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{s.description}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                              s.gradient,
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[11px] font-extrabold text-muted-foreground tabular-nums w-10 text-right">
                          {pct}%
                        </div>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                        {completed}/{total} nodi · {totalLevels}/{maxLevels} livelli
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>

      <BottomNav />
    </div>
  );
}
