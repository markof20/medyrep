import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  getNodeById,
  getSubjectByNodeId,
  LEVELS_PER_NODE,
  QUESTIONS_PER_LEVEL,
} from "@/data/medContent";
import {
  getNodeProgress,
  isLevelCompleted,
  isLevelUnlocked,
  useMedStore,
} from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { ArrowLeft, Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/node/$nodeId")({
  component: NodePage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Nodo non trovato.{" "}
      <Link to="/" className="text-primary underline">
        Torna alle materie
      </Link>
    </div>
  ),
});

function NodePage() {
  const { nodeId } = Route.useParams();
  const navigate = useNavigate();
  const node = useMemo(() => getNodeById(nodeId), [nodeId]);
  const subject = useMemo(() => getSubjectByNodeId(nodeId), [nodeId]);
  const { state } = useMedStore();
  const [showNoLives, setShowNoLives] = useState(false);

  if (!subject || !node) {
    return (
      <div className="p-8 text-center">
        Nodo non trovato.{" "}
        <Link to="/" className="text-primary underline">
          Torna alle materie
        </Link>
      </div>
    );
  }

  const levelIds = node.levels.map((l) => l.id);
  const np = getNodeProgress(state, node.id);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4">
        <button
          onClick={() => navigate({ to: "/subject/$subjectId", params: { subjectId } })}
          className="flex items-center gap-1 text-sm font-extrabold text-muted-foreground mb-3 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {subject.name}
        </button>

        <div
          className={cn(
            "rounded-3xl bg-gradient-to-br text-primary-foreground p-5 node-shadow mb-6",
            subject.gradient,
          )}
        >
          <div className="text-3xl mb-1">{node.emoji}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">
            {subject.name} · Nodo
          </div>
          <h1 className="text-2xl font-extrabold mt-0.5">{node.title}</h1>
          <p className="text-sm opacity-90 mt-1">{node.subtitle}</p>
          <div className="mt-3 text-[11px] font-extrabold uppercase tracking-wider opacity-90">
            {np.completedLevels.length}/{LEVELS_PER_NODE} livelli · {QUESTIONS_PER_LEVEL} domande per livello
          </div>
        </div>

        <ol className="space-y-3">
          {node.levels.map((lvl, idx) => {
            const unlocked = isLevelUnlocked(state, node.id, levelIds, lvl.id);
            const completed = isLevelCompleted(state, node.id, lvl.id);

            const Body = (
              <div
                className={cn(
                  "relative w-full rounded-3xl border-2 bg-card p-4 node-shadow flex items-center gap-4 transition animate-pop-in",
                  unlocked && "hover:-translate-y-0.5 active:translate-y-0.5",
                  !unlocked && "opacity-70",
                )}
              >
                <div
                  className={cn(
                    "grid place-items-center size-12 rounded-2xl text-lg font-extrabold shrink-0",
                    completed
                      ? "bg-success text-success-foreground"
                      : unlocked
                        ? "bg-gradient-to-br text-primary-foreground " + subject.gradient
                        : "bg-locked text-white",
                  )}
                >
                  {completed ? (
                    <Check className="size-6" strokeWidth={3} />
                  ) : unlocked ? (
                    <span>L{idx + 1}</span>
                  ) : (
                    <Lock className="size-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Livello {idx + 1}
                  </div>
                  <div className="font-extrabold text-foreground leading-tight truncate">
                    {lvl.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {QUESTIONS_PER_LEVEL} domande · misto quiz, V/F, casi
                  </div>
                </div>
                {unlocked && !completed && (
                  <div className="grid place-items-center size-9 rounded-full bg-primary text-primary-foreground shrink-0">
                    <Play className="size-4 fill-current" />
                  </div>
                )}
              </div>
            );

            if (!unlocked) {
              return (
                <li key={lvl.id}>
                  <button
                    onClick={() => {
                      if (state.lives === 0) setShowNoLives(true);
                    }}
                    className="w-full text-left"
                  >
                    {Body}
                  </button>
                </li>
              );
            }
            return (
              <li key={lvl.id}>
                <Link
                  to="/lesson/$nodeId/$levelId"
                  params={{ nodeId: node.id, levelId: lvl.id }}
                  className="block"
                >
                  {Body}
                </Link>
              </li>
            );
          })}
        </ol>
      </main>

      <BottomNav />
      <NoLivesDialog open={showNoLives} onOpenChange={setShowNoLives} />
    </div>
  );
}
