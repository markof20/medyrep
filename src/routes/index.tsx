import { createFileRoute, Link } from "@tanstack/react-router";
import { SUBJECTS, getNodesForSubject } from "@/data/medContent";
import { isNodeCompleted, useMedStore, getNodeProgress } from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { Sparkles, Trophy, Flame, Star, Play, Crown, Zap, Target } from "lucide-react";
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

type SubjectStats = {
  s: (typeof SUBJECTS)[number];
  total: number;
  completed: number;
  totalLevels: number;
  maxLevels: number;
  pct: number;
  level: number;
  rank: string;
};

function rankFor(level: number): string {
  if (level >= 10) return "Primario";
  if (level >= 7) return "Specializzando";
  if (level >= 4) return "Tirocinante";
  if (level >= 1) return "Matricola";
  return "Nuovo";
}

function HomePage() {
  const { state } = useMedStore();

  const stats: SubjectStats[] = SUBJECTS.map((s) => {
    const nodes = getNodesForSubject(s.id);
    const total = nodes.length;
    const completed = nodes.filter((n) => isNodeCompleted(state, n.id)).length;
    const totalLevels = nodes.reduce(
      (acc, n) =>
        acc + Math.min(n.levels.length, getNodeProgress(state, n.id).completedLevels.length),
      0,
    );
    const maxLevels = nodes.reduce((acc, n) => acc + n.levels.length, 0);
    const pct = maxLevels === 0 ? 0 : Math.round((totalLevels / maxLevels) * 100);
    const level = Math.floor(totalLevels / 3) + (totalLevels > 0 ? 1 : 0);
    return { s, total, completed, totalLevels, maxLevels, pct, level, rank: rankFor(level) };
  });

  const featured =
    stats.find((x) => x.totalLevels > 0 && x.pct < 100) ?? stats[0];
  const others = stats.filter((x) => x.s.id !== featured.s.id);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />

      <main className="mx-auto max-w-md px-4 pt-4">
        {/* Daily mission banner */}
        <div className="rounded-3xl border-2 border-warning/40 bg-gradient-to-br from-warning/20 to-warning/5 p-4 node-shadow mb-4 flex items-center gap-3 animate-pop-in">
          <div className="grid place-items-center size-12 rounded-2xl bg-warning text-warning-foreground text-2xl shrink-0 animate-flame">
            <Target className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-warning-foreground/70">
              Missione di oggi
            </div>
            <div className="font-extrabold text-foreground text-sm leading-tight">
              Completa 1 livello e guadagna <span className="text-warning-foreground">+50 XP</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-warning/20 overflow-hidden">
              <div
                className="h-full bg-warning rounded-full transition-all"
                style={{ width: `${Math.min(100, (state.weeklyXp % 50) * 2)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Featured "continua" card */}
        <FeaturedCard data={featured} />

        {/* Header for list */}
        <div className="flex items-center justify-between mt-6 mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              Tutte le materie
            </h2>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {stats.length} percorsi
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {others.map((d) => (
            <li key={d.s.id}>
              <SubjectTile data={d} />
            </li>
          ))}
        </ul>
      </main>

      <BottomNav />
    </div>
  );
}

function FeaturedCard({ data }: { data: SubjectStats }) {
  const { s, pct, level, rank, completed, total } = data;
  const isNew = data.totalLevels === 0;
  return (
    <Link to="/subject/$subjectId" params={{ subjectId: s.id }} className="block">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl p-5 text-primary-foreground node-shadow",
          "bg-gradient-to-br",
          s.gradient,
          "hover:-translate-y-0.5 active:translate-y-0.5 transition",
        )}
      >
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-12 -left-6 size-32 rounded-full bg-black/10 blur-2xl" />

        <div className="relative flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest opacity-90">
          {isNew ? <Zap className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
          {isNew ? "Inizia ora" : "Continua a giocare"}
        </div>

        <div className="relative flex items-center gap-4 mt-2">
          <div className="grid place-items-center size-20 rounded-3xl bg-white/25 backdrop-blur text-5xl shrink-0 border-2 border-white/40 animate-wiggle">
            <span>{s.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-extrabold leading-tight truncate">{s.name}</div>
            <div className="text-xs opacity-90 truncate">{s.description}</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                <Crown className="size-3" /> Lv. {level}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                {rank}
              </span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider opacity-90 mb-1">
            <span>Progresso materia</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-black/25 overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-warning to-white rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Trophy className="size-3.5" /> {completed}/{total} nodi
              </span>
              <span className="inline-flex items-center gap-1">
                <Flame className="size-3.5 text-warning" /> {data.totalLevels} lv
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white text-primary px-3 py-1 font-extrabold uppercase tracking-wider text-[10px] btn-pop border-b-foreground/20">
              {isNew ? "Gioca" : "Riprendi"} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SubjectTile({ data }: { data: SubjectStats }) {
  const { s, pct, level, completed, total } = data;
  const r = 28;
  const C = 2 * Math.PI * r;
  const dash = C * (pct / 100);

  return (
    <Link to="/subject/$subjectId" params={{ subjectId: s.id }} className="block group">
      <div className="relative rounded-3xl border-2 bg-card p-3 node-shadow hover:-translate-y-0.5 active:translate-y-0.5 transition h-full flex flex-col items-center text-center">
        {/* Level badge */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-warning text-warning-foreground text-[10px] font-extrabold px-2 py-0.5 border-2 border-card uppercase tracking-wider flex items-center gap-1">
          <Star className="size-3 fill-current" /> Lv {level}
        </div>

        {/* Emoji w/ progress ring */}
        <div className="relative size-20 mt-1">
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
            <circle cx="32" cy="32" r={r} className="fill-none stroke-secondary" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r={r}
              className="fill-none stroke-primary transition-all duration-700"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - dash}
            />
          </svg>
          <div
            className={cn(
              "absolute inset-1.5 rounded-full grid place-items-center text-3xl bg-gradient-to-br text-primary-foreground",
              s.gradient,
            )}
          >
            <span className="group-hover:animate-wiggle">{s.emoji}</span>
          </div>
        </div>

        <div className="mt-2 font-extrabold text-foreground text-sm leading-tight line-clamp-1 w-full">
          {s.name}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {completed}/{total} nodi
        </div>

        <div className="mt-2 w-full flex items-center justify-center gap-1">
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r", s.gradient)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-extrabold text-muted-foreground tabular-nums w-7 text-right">
            {pct}%
          </span>
        </div>
      </div>
    </Link>
  );
}
