import { createFileRoute, Link } from "@tanstack/react-router";
import { SUBJECTS, getNodesForSubject, REQUIRED_RUNS } from "@/data/medContent";
import { isNodeCompleted, useMedStore, getNodeProgress } from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { ChevronRight, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedRep — Materie di medicina, micro-apprendimento gamificato" },
      {
        name: "description",
        content:
          "Studia medicina materia per materia: Anatomia, Fisiologia, Biochimica e altre. Quiz, casi clinici, XP e streak. Mobile-first.",
      },
      { property: "og:title", content: "MedRep — Studia medicina, livello per livello" },
      { property: "og:description", content: "Percorsi a livelli su più materie, con vite, XP e classifica globale." },
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
            Avanza un nodo alla volta, accumula XP e mantieni la striscia.
          </p>
        </div>

        <ul className="space-y-3">
          {SUBJECTS.map((s) => {
            const nodes = getNodesForSubject(s.id);
            const total = nodes.length;
            const completed = nodes.filter((n) => isNodeCompleted(state, n.id)).length;
            const totalRuns = nodes.reduce(
              (acc, n) => acc + Math.min(REQUIRED_RUNS, getNodeProgress(state, n.id).runs),
              0,
            );
            const maxRuns = total * REQUIRED_RUNS;
            const pct = maxRuns === 0 ? 0 : Math.round((totalRuns / maxRuns) * 100);
            const Body = (
              <div
                className={cn(
                  "relative w-full rounded-3xl border-2 bg-card p-4 node-shadow flex items-center gap-4 transition",
                  !s.comingSoon && "hover:-translate-y-0.5 active:translate-y-0.5",
                  s.comingSoon && "opacity-70",
                )}
              >
                <div
                  className={cn(
                    "grid place-items-center size-14 rounded-2xl text-3xl shrink-0 bg-gradient-to-br text-primary-foreground",
                    s.gradient,
                  )}
                >
                  {s.comingSoon ? <Lock className="size-6" /> : <span>{s.emoji}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-extrabold text-foreground leading-tight truncate">
                      {s.name}
                    </div>
                    {s.comingSoon && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Presto
                      </span>
                    )}
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
                    {s.comingSoon
                      ? "Contenuti in arrivo"
                      : `${completed}/${total} nodi · ${totalRuns}/${maxRuns} corone`}
                  </div>
                </div>
                {!s.comingSoon && (
                  <ChevronRight className="size-5 text-muted-foreground shrink-0" />
                )}
              </div>
            );

            if (s.comingSoon) {
              return (
                <li key={s.id} aria-disabled className="block">
                  {Body}
                </li>
              );
            }
            return (
              <li key={s.id}>
                <Link
                  to="/subject/$subjectId"
                  params={{ subjectId: s.id }}
                  className="block"
                >
                  {Body}
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
