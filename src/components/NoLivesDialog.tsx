import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Infinity, Sparkles } from "lucide-react";
import { useMedStore } from "@/lib/medStore";

export function NoLivesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { refillLives } = useMedStore();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader className="items-center text-center">
          <div className="size-20 rounded-full bg-life/10 grid place-items-center mb-2">
            <Heart className="size-10 text-life fill-life" />
          </div>
          <DialogTitle className="text-2xl">Vite esaurite!</DialogTitle>
          <DialogDescription>
            Hai finito le vite. Le vite si rigenerano nel tempo, oppure passa a <b>MedRep Plus</b> per averle infinite.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div className="rounded-2xl border-2 border-warning bg-warning/10 p-4 flex items-center gap-3">
            <Infinity className="size-7 text-warning-foreground" />
            <div className="flex-1">
              <div className="font-extrabold">Vite Infinite</div>
              <div className="text-xs text-muted-foreground">Studia senza limiti, 4,99€/mese</div>
            </div>
            <Sparkles className="size-5 text-warning" />
          </div>
          <Button
            className="w-full btn-pop bg-warning text-warning-foreground hover:bg-warning border-warning-foreground/20 h-12 text-base"
            onClick={() => onOpenChange(false)}
          >
            Scopri Plus
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              refillLives();
              onOpenChange(false);
            }}
          >
            Usa una ricarica gratuita (demo)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
