import { Flame, Heart, Zap } from "lucide-react";
import { useMedStore } from "@/lib/medStore";

export function MedHeader() {
  const { state, MAX_LIVES } = useMedStore();
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
          <Flame className="size-5 text-streak fill-streak" />
          <span className="font-extrabold text-foreground">{state.streak}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
          <Zap className="size-5 text-warning fill-warning" />
          <span className="font-extrabold text-foreground">{state.xp}</span>
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
