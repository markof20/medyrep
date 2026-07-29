import { Flame, Gem, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMedStore } from "@/lib/medStore";
import { Mascot } from "@/components/Mascot";
import { cn } from "@/lib/utils";

/** Header del percorso: mascotte a sinistra, card con streak, XP e vite a destra. */
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
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
        <Mascot pose="wave" className="size-16 shrink-0 -my-1" />

        <div className="flex-1 grid grid-cols-3 rounded-2xl bg-card soft-shadow border overflow-hidden">
          <Stat
            icon={
              <Flame
                className={cn(
                  "size-5 text-streak fill-streak",
                  state.streak > 0 && "animate-flame",
                )}
              />
            }
            value={state.streak}
            label="giorni di fila"
          />
          <div className="relative border-l">
            <Stat
              icon={
                <span className="inline-flex animate-gem-shine">
                  <Gem
                    key={xpBump}
                    className={cn("size-5 text-gem fill-gem/30", xpBump > 0 && "animate-xp-bump")}
                  />
                </span>
              }
              value={state.xp}
              label="XP"
            />
            {xpDelta !== null && (
              <span
                key={`d-${xpBump}`}
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 text-xs font-extrabold text-warning-foreground bg-warning px-1.5 py-0.5 rounded-full animate-xp-float shadow-md"
              >
                +{xpDelta}
              </span>
            )}
          </div>
          <div className="border-l">
            <Stat
              icon={
                <Heart
                  className={cn(
                    "size-5 text-life fill-life",
                    state.lives > 0 && "animate-heart-beat",
                  )}
                />
              }
              value={state.lives}
              label={`di ${MAX_LIVES}`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-2">
      {icon}
      <div className="min-w-0">
        <div className="font-extrabold text-foreground leading-none tabular-nums">{value}</div>
        <div className="text-[9px] font-bold text-muted-foreground leading-tight truncate">
          {label}
        </div>
      </div>
    </div>
  );
}
