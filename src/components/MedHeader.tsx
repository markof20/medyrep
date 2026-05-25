import { Flame, Heart, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMedStore } from "@/lib/medStore";
import { cn } from "@/lib/utils";

export function MedHeader() {
  const { state, MAX_LIVES } = useMedStore();
  const prevXp = useRef(state.xp);
  const [xpBump, setXpBump] = useState(0);
  const [xpDelta, setXpDelta] = useState<number | null>(null);

  useEffect(() => {
    if (state.xp !== prevXp.current) {
      const diff = state.xp - prevXp.current;
      prevXp.current = state.xp;
      if (diff > 0) {
        setXpBump((n) => n + 1);
        setXpDelta(diff);
        const t = setTimeout(() => setXpDelta(null), 1000);
        return () => clearTimeout(t);
      }
    }
  }, [state.xp]);

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
          <Flame
            className={cn(
              "size-5 text-streak fill-streak",
              state.streak > 0 && "animate-flame",
            )}
          />
          <span className="font-extrabold text-foreground">{state.streak}</span>
        </div>
        <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
          <Zap
            key={xpBump}
            className={cn("size-5 text-warning fill-warning", xpBump > 0 && "animate-xp-bump")}
          />
          <span className="font-extrabold text-foreground tabular-nums">{state.xp}</span>
          {xpDelta !== null && (
            <span
              key={`d-${xpBump}`}
              className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-extrabold text-warning-foreground bg-warning px-1.5 py-0.5 rounded-full animate-xp-float shadow-md"
            >
              +{xpDelta}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
          <Heart className="size-5 text-life fill-life" />
          <span className="font-extrabold text-foreground">
            {state.lives}
            <span className="text-muted-foreground font-bold">/{MAX_LIVES}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
