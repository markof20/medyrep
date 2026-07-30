import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { NODES, getNodeById } from "@/data/medContent";
import { getCurrentNodeId, isLevelCompleted, isLevelUnlocked, useMedStore } from "@/lib/medStore";
import { getModules } from "@/lib/structure";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { Mascot } from "@/components/Mascot";
import { ChevronRight, Play, RefreshCw, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — MedRep" },
      { name: "description", content: "Quiz del giorno, ripasso degli errori e sfide." },
    ],
  }),
  component: QuizHubPage,
});

/**
 * Primo livello disponibile del nodo: i moduli sono percorsi indipendenti,
 * quindi si cerca modulo per modulo (in ordine) il primo livello sbloccato
 * e non ancora completato al loro interno.
 */
function nextLevelId(state: ReturnType<typeof useMedStore>["state"], nodeId: string) {
  const node = getNodeById(nodeId);
  if (!node) return null;
  for (const mod of getModules(node)) {
    const levelIds = mod.levels.map((l) => l.id);
    const next = mod.levels.find(
      (l) =>
        !isLevelCompleted(state, nodeId, l.id) && isLevelUnlocked(state, nodeId, levelIds, l.id),
    );
    if (next) return next.id;
  }
  return null;
}

function QuizHubPage() {
  const { state } = useMedStore();
  const router = useRouter();

  const currentNodeId = getCurrentNodeId(state);
  const currentNode = currentNodeId ? getNodeById(currentNodeId) : null;
  const levelId = currentNodeId ? nextLevelId(state, currentNodeId) : null;
  const canPlay = Boolean(currentNodeId && levelId);

  const mistakes = state.mistakes.length;

  return (
    <div className="min-h-screen pb-28 bg-background">
      <MedHeader />

      <main className="mx-auto max-w-md px-4 space-y-3">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-deep p-4 text-primary-foreground soft-shadow-lg">
          <div className="flex items-center gap-3">
            <Mascot pose="cheer" className="size-20 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
                {NODES.length} esami disponibili
              </div>
              <h1 className="text-xl font-extrabold leading-tight">Quiz del giorno</h1>
              <p className="text-xs font-bold opacity-90 leading-snug">
                {canPlay && currentNode
                  ? currentNode.title
                  : "Hai completato tutti gli esami disponibili! 🎉"}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!canPlay}
            onClick={() => {
              if (currentNodeId && levelId) {
                router.navigate({
                  to: "/lesson/$nodeId/$levelId",
                  params: { nodeId: currentNodeId, levelId },
                });
              }
            }}
            className={cn(
              "mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-card px-4 py-3 font-extrabold text-primary transition",
              canPlay ? "active:scale-[0.99]" : "opacity-50 cursor-not-allowed",
            )}
          >
            <Play className="size-4 fill-current" />
            {canPlay ? "Inizia · +20 XP" : "Nessun quiz disponibile"}
          </button>
        </div>

        <HubRow
          to="/review"
          icon={<RefreshCw className="size-5 text-warning" />}
          tint="bg-warning/15"
          title="Ripassa i tuoi errori"
          subtitle={
            mistakes === 0
              ? "Nessun errore da ripassare, ottimo!"
              : `${mistakes} ${mistakes === 1 ? "domanda sbagliata" : "domande sbagliate"}`
          }
        />
        <HubRow
          to="/leaderboard"
          icon={<Trophy className="size-5 text-success" />}
          tint="bg-success/15"
          title="Classifica"
          subtitle="Confrontati con gli altri studenti"
        />
        <HubRow
          to="/friends"
          icon={<Users className="size-5 text-primary" />}
          tint="bg-primary/10"
          title="Amici"
          subtitle="Studia insieme, resta motivato"
        />
      </main>

      <BottomNav />
    </div>
  );
}

function HubRow({
  to,
  icon,
  tint,
  title,
  subtitle,
}: {
  to: string;
  icon: React.ReactNode;
  tint: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border bg-card px-3 py-3 soft-shadow active:scale-[0.99] transition"
    >
      <span className={cn("grid place-items-center size-11 rounded-2xl shrink-0", tint)}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-extrabold text-foreground leading-tight">{title}</span>
        <span className="block text-[11px] font-bold text-muted-foreground leading-snug">
          {subtitle}
        </span>
      </span>
      <ChevronRight className="size-5 text-muted-foreground shrink-0" />
    </Link>
  );
}
