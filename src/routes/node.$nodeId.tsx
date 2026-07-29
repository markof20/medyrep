import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { getNodeById, getSubjectByNodeId, isReviewNode } from "@/data/medContent";
import { useMedStore } from "@/lib/medStore";
import { getModuleProgress, getModules } from "@/lib/structure";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/node/$nodeId")({
  component: NodePage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Esame non trovato.{" "}
      <Link to="/" className="text-primary underline">
        Torna al percorso
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

  if (!subject || !node) {
    return (
      <div className="p-8 text-center">
        Esame non trovato.{" "}
        <Link to="/" className="text-primary underline">
          Torna al percorso
        </Link>
      </div>
    );
  }

  const modules = getModules(node);
  const review = isReviewNode(node);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4">
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1 text-sm font-extrabold text-muted-foreground mb-3 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Percorso
        </button>

        <div
          className={cn(
            "rounded-3xl bg-gradient-to-br text-primary-foreground p-5 soft-shadow-lg mb-6",
            subject.gradient,
          )}
        >
          <div className="text-3xl mb-1">{node.emoji}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Esame</div>
          <h1 className="text-2xl font-extrabold mt-0.5">{node.title}</h1>
          <p className="text-sm opacity-90 mt-1">{node.subtitle}</p>
          {!review && (
            <div className="mt-3 text-[11px] font-extrabold uppercase tracking-wider opacity-90">
              4 moduli · scegli quale studiare per primo
            </div>
          )}
        </div>

        <ol className="space-y-3">
          {modules.map((mod) => {
            const progress = getModuleProgress(state, node, mod.index);
            const done = progress.total > 0 && progress.done >= progress.total;
            return (
              <li key={mod.index}>
                <Link
                  to="/node/$nodeId/module/$moduleIndex"
                  params={{ nodeId: node.id, moduleIndex: String(mod.index) }}
                  className="block rounded-3xl border-2 bg-card p-4 soft-shadow flex items-center gap-4 active:scale-[0.99] transition"
                >
                  <div
                    className={cn(
                      "grid place-items-center size-12 rounded-2xl text-lg font-extrabold shrink-0",
                      done
                        ? "bg-success text-success-foreground"
                        : "bg-gradient-to-br text-primary-foreground " + subject.gradient,
                    )}
                  >
                    {done ? <Check className="size-6" strokeWidth={3} /> : mod.index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-foreground leading-tight">{mod.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{mod.subtitle}</div>
                    <div className="mt-1 text-[11px] font-extrabold text-muted-foreground tabular-nums">
                      {progress.done}/{progress.total} livelli
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground shrink-0" />
                </Link>
              </li>
            );
          })}
        </ol>
      </main>

      <BottomNav />
    </div>
  );
}
