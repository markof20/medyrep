import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { findQuestion, NODES, type Flashcard } from "@/data/medContent";
import { useMedStore } from "@/lib/medStore";
import { GlossaryText } from "@/components/GlossaryText";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Sparkles, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Ripasso — MedRep" },
      { name: "description", content: "Ripassa i tuoi errori e usa le flashcard per fissare i concetti." },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4">
        <h1 className="text-2xl font-extrabold mb-4">Ripasso</h1>
        <Tabs defaultValue="mistakes" className="w-full">
          <TabsList className="grid grid-cols-2 w-full h-12 rounded-2xl">
            <TabsTrigger value="mistakes" className="rounded-xl font-extrabold">I miei Errori</TabsTrigger>
            <TabsTrigger value="cards" className="rounded-xl font-extrabold">Flashcard</TabsTrigger>
          </TabsList>
          <TabsContent value="mistakes" className="mt-4">
            <MistakesTab />
          </TabsContent>
          <TabsContent value="cards" className="mt-4">
            <FlashcardsTab />
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}

function MistakesTab() {
  const { state, addXp, removeMistake, recordMistake } = useMedStore();
  const items = useMemo(() => state.mistakes.map((id) => findQuestion(id)).filter(Boolean), [state.mistakes]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tf, setTf] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed p-8 text-center">
        <div className="text-5xl mb-2">🎯</div>
        <div className="font-extrabold text-lg">Nessun errore da ripassare</div>
        <p className="text-sm text-muted-foreground mt-1">
          Complimenti! Quando sbaglierai una domanda, comparirà qui per ripassarla.
        </p>
        <Link to="/" className="inline-block mt-4 text-primary font-extrabold">
          Vai al percorso →
        </Link>
      </div>
    );
  }

  const safeIdx = Math.min(idx, items.length - 1);
  const entry = items[safeIdx]!;
  const q = entry.question;
  const correct = q.type === "truefalse" ? tf === q.answer : selected === (q as any).correctIndex;

  function next(removeIfCorrect: boolean) {
    if (removeIfCorrect && correct) {
      addXp(5);
      removeMistake(q.id);
    } else if (submitted && !correct) {
      recordMistake(q.id);
    }
    setSelected(null);
    setTf(null);
    setSubmitted(false);
    setIdx((i) => (items.length <= 1 ? 0 : (i + 1) % items.length));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-bold">
        <span>{items.length} domand{items.length === 1 ? "a" : "e"} da ripassare</span>
        <span>{safeIdx + 1} / {items.length}</span>
      </div>

      <div className="rounded-3xl bg-card border-2 p-5 node-shadow">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary mb-1">
          {entry.node.emoji} {entry.node.title}
        </div>
        {q.type === "clinical" && (
          <div className="mb-3 rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm">
            <b className="text-primary">Scenario:</b> {q.scenario}
          </div>
        )}
        <h3 className="text-lg font-extrabold leading-tight mb-4">
          <GlossaryText text={q.prompt} />
        </h3>

        {q.type === "truefalse" ? (
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                disabled={submitted}
                onClick={() => setTf(v)}
                className={cn(
                  "btn-pop border-2 bg-card p-3 font-extrabold",
                  tf === v ? "border-primary bg-primary/10" : "border-border",
                  submitted && v === q.answer && "border-success bg-success/15",
                  submitted && tf === v && v !== q.answer && "border-destructive bg-destructive/10"
                )}
              >
                {v ? "Vero" : "Falso"}
              </button>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const correctI = (q as any).correctIndex;
              return (
                <li key={i}>
                  <button
                    disabled={submitted}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "btn-pop w-full border-2 bg-card p-3 text-left font-bold text-sm",
                      isSel ? "border-primary bg-primary/10" : "border-border",
                      submitted && i === correctI && "border-success bg-success/15",
                      submitted && isSel && i !== correctI && "border-destructive bg-destructive/10"
                    )}
                  >
                    <GlossaryText text={opt} className="inline" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {submitted && (
          <div className={cn("mt-4 rounded-xl p-3 text-sm border-2", correct ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive")}>
            <div className={cn("font-extrabold mb-1 flex items-center gap-1", correct ? "text-success" : "text-destructive")}>
              {correct ? <><Check className="size-4" /> Corretto!</> : <><X className="size-4" /> Riprova alla prossima</>}
            </div>
            <GlossaryText text={q.explanation} />
          </div>
        )}

        <div className="mt-4">
          {!submitted ? (
            <Button
              className="w-full h-12 btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20"
              disabled={q.type === "truefalse" ? tf === null : selected === null}
              onClick={() => setSubmitted(true)}
            >
              Verifica
            </Button>
          ) : (
            <Button
              className={cn(
                "w-full h-12 btn-pop text-white border-black/20",
                correct ? "bg-success hover:bg-success" : "bg-destructive hover:bg-destructive"
              )}
              onClick={() => next(true)}
            >
              {correct ? <><Sparkles className="size-4 mr-1" /> +5 XP · Continua</> : "Prossima"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FlashcardsTab() {
  const { state } = useMedStore();
  const unlockedIds = useMemo(() => {
    const ids: string[] = [];
    for (let i = 0; i < NODES.length; i++) {
      const id = NODES[i].id;
      const prevDone =
        i === 0 || (state.nodeProgress[NODES[i - 1].id]?.completedLevels.length ?? 0) > 0;
      if (prevDone) ids.push(id);
    }
    return ids;
  }, [state.nodeProgress]);
  const [nodeId, setNodeId] = useState(unlockedIds[0] ?? NODES[0].id);
  const node = NODES.find((n) => n.id === nodeId)!;
  const cards: Flashcard[] = node.flashcards;
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return <div className="text-center text-muted-foreground">Nessuna flashcard.</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {NODES.map((n) => {
          const locked = !unlockedIds.includes(n.id);
          const active = n.id === nodeId;
          return (
            <button
              key={n.id}
              disabled={locked}
              onClick={() => { setNodeId(n.id); setI(0); setFlipped(false); }}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold border-2 transition",
                active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border",
                locked && "opacity-40"
              )}
            >
              {n.emoji} {n.title}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className={cn(
          "relative w-full aspect-[4/3] rounded-3xl border-2 node-shadow p-6 flex flex-col items-center justify-center text-center transition-colors",
          flipped ? "bg-success/10 border-success" : "bg-card border-primary/30"
        )}
      >
        <BookOpen className={cn("size-6 absolute top-4 left-4", flipped ? "text-success" : "text-primary")} />
        <div className="text-[10px] uppercase tracking-wider font-extrabold opacity-60 mb-2">
          {flipped ? "Risposta" : "Domanda"}
        </div>
        <div className="text-xl font-extrabold leading-snug">
          {flipped ? cards[i].back : cards[i].front}
        </div>
        <div className="absolute bottom-4 text-xs text-muted-foreground">Tocca per girare</div>
      </button>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 btn-pop bg-card"
          onClick={() => { setI((x) => (x - 1 + cards.length) % cards.length); setFlipped(false); }}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="text-sm font-extrabold text-muted-foreground">
          {i + 1} / {cards.length}
        </div>
        <Button
          variant="outline"
          className="flex-1 h-12 btn-pop bg-card"
          onClick={() => { setFlipped(false); setI((x) => (x + 1) % cards.length); }}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => { setFlipped(false); setI(0); }}
      >
        <RotateCcw className="size-4 mr-1" /> Ricomincia mazzo
      </Button>
    </div>
  );
}
