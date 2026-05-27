import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SUBJECTS, getNodesForSubject, LEVELS_PER_NODE } from "@/data/medContent";
import {
  getNodeProgress,
  isNodeCompleted,
  isNodeUnlocked,
  useMedStore,
} from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { ArrowLeft, Check, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subject/$subjectId")({
  component: SubjectPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Materia non trovata.{" "}
      <Link to="/" className="text-primary underline">
        Torna alle materie
      </Link>
    </div>
  ),
});

function SubjectPage() {
  const { subjectId } = Route.useParams();
  const navigate = useNavigate();
  const subject = useMemo(() => SUBJECTS.find((s) => s.id === subjectId), [subjectId]);
  const nodes = useMemo(() => getNodesForSubject(subjectId), [subjectId]);
  const { state } = useMedStore();
  const nodeIds = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const [showNoLives, setShowNoLives] = useState(false);

  if (!subject) {
    return (
      <div className="p-8 text-center">
        Materia non trovata.{" "}
        <Link to="/" className="text-primary underline">
          Torna alle materie
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4">
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1 text-sm font-extrabold text-muted-foreground mb-3 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Materie
        </button>

        <div
          className={cn(
            "rounded-3xl bg-gradient-to-br text-primary-foreground p-5 node-shadow mb-6",
            subject.gradient,
          )}
        >
          <div className="text-3xl mb-1">{subject.emoji}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Materia</div>
          <h1 className="text-2xl font-extrabold mt-0.5">{subject.name}</h1>
          <p className="text-sm opacity-90 mt-1">{subject.description}</p>
          <div className="mt-3 text-[11px] font-extrabold uppercase tracking-wider opacity-90">
            {nodes.length} nodi · {LEVELS_PER_NODE} livelli ciascuno
          </div>
        </div>

        <ol className="relative pt-2 pb-6">
          {nodes.map((node, idx) => {
            const offsets = [0, 72, 96, 72, 0, -72, -96, -72];
            const dx = offsets[idx % offsets.length];
            const isLast = idx === nodes.length - 1;
            const unlocked = isNodeUnlocked(state, nodeIds, node.id);
            const np = getNodeProgress(state, node.id);
            const completed = isNodeCompleted(state, node.id);
            const doneLevels = np.completedLevels.length;
            const pct = Math.round((doneLevels / LEVELS_PER_NODE) * 100);

            const Body = (
              <div
                className={cn(
                  "relative flex flex-col items-center gap-1 transition",
                  unlocked && "hover:-translate-y-0.5 active:translate-y-0.5",
                  !unlocked && "opacity-60",
                )}
              >
                {/* Stars above */}
                <div className="flex items-center gap-0.5 mb-0.5">
                  {Array.from({ length: LEVELS_PER_NODE }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-2.5",
                        i < doneLevels
                          ? "text-warning fill-warning"
                          : "text-muted-foreground/30",
                      )}
                      strokeWidth={2.5}
                    />
                  ))}
                </div>

                {/* Circular node */}
                <div className="relative">
                  {/* Progress ring */}
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 80 80"
                    width="80"
                    height="80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      className="stroke-secondary"
                      strokeWidth="4"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      className={cn(
                        completed ? "stroke-success" : "stroke-primary",
                      )}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - pct / 100)}
                      style={{ transition: "stroke-dashoffset 500ms" }}
                    />
                  </svg>
                  <div
                    className={cn(
                      "grid place-items-center size-20 rounded-full text-3xl bg-gradient-to-br text-primary-foreground node-shadow border-4 border-background",
                      completed ? "from-success to-success/70" : subject.gradient,
                    )}
                  >
                    {unlocked ? (
                      completed ? (
                        <Check className="size-9" strokeWidth={3} />
                      ) : (
                        <span>{node.emoji}</span>
                      )
                    ) : (
                      <Lock className="size-7" />
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="text-center mt-1 px-2 max-w-[180px]">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Nodo {idx + 1}
                  </div>
                  <div className="font-extrabold text-sm text-foreground leading-tight truncate">
                    {node.title}
                  </div>
                </div>
              </div>
            );

            return (
              <li
                key={node.id}
                className="relative flex flex-col items-center"
                style={{ transform: `translateX(${dx}px)`, marginTop: idx === 0 ? 0 : 8 }}
              >
                {!unlocked ? (
                  <button
                    onClick={() => {
                      if (state.lives === 0) setShowNoLives(true);
                    }}
                  >
                    {Body}
                  </button>
                ) : (
                  <Link to="/node/$nodeId" params={{ nodeId: node.id }}>
                    {Body}
                  </Link>
                )}
                {!isLast && (
                  <div
                    aria-hidden
                    className="my-2 h-6 w-1.5 rounded-full bg-muted-foreground/20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 8px)",
                      color: "hsl(var(--muted-foreground) / 0.35)",
                      background: "none",
                    }}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Hai padroneggiato {nodes.filter((n) => isNodeCompleted(state, n.id)).length}/{nodes.length} nodi
        </div>
      </main>

      <BottomNav />
      <NoLivesDialog open={showNoLives} onOpenChange={setShowNoLives} />
    </div>
  );
}
