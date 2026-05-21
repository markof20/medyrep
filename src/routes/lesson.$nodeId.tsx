import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { NODES, type Question } from "@/data/medContent";
import { useMedStore } from "@/lib/medStore";
import { Button } from "@/components/ui/button";
import { GlossaryText } from "@/components/GlossaryText";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { ArrowLeft, Check, Heart, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lesson/$nodeId")({
  component: LessonPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Nodo non trovato. <Link to="/" className="text-primary underline">Torna al percorso</Link>
    </div>
  ),
});

function LessonPage() {
  const { nodeId } = Route.useParams();
  const navigate = useNavigate();
  const node = useMemo(() => NODES.find((n) => n.id === nodeId), [nodeId]);
  const { state, addXp, loseLife, recordMistake, setNodeProgress, MAX_LIVES } = useMedStore();

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tfAnswer, setTfAnswer] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showNoLives, setShowNoLives] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (state.lives === 0 && !done) setShowNoLives(true);
  }, [state.lives, done]);

  if (!node) return null;
  const total = node.questions.length;
  const q = node.questions[idx];

  function isAnswerSelected() {
    if (q.type === "truefalse") return tfAnswer !== null;
    return selected !== null;
  }
  function isCorrect(): boolean {
    if (q.type === "truefalse") return tfAnswer === q.answer;
    return selected === (q as Exclude<Question, { type: "truefalse" }>).correctIndex;
  }

  function handleCheck() {
    if (!isAnswerSelected()) return;
    setSubmitted(true);
    const ok = isCorrect();
    if (ok) {
      setCorrectCount((c) => c + 1);
      addXp(10);
    } else {
      setWrongCount((c) => c + 1);
      loseLife();
      recordMistake(q.id);
    }
  }

  function handleNext() {
    if (idx + 1 >= total) {
      // finish lesson
      const finalCorrect = correctCount;
      setNodeProgress(node!.id, finalCorrect, total);
      if (finalCorrect === total) addXp(20); // perfect bonus
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setTfAnswer(null);
    setSubmitted(false);
  }

  if (done) {
    return (
      <FinishScreen
        correct={correctCount}
        wrong={wrongCount}
        total={total}
        onClose={() => navigate({ to: "/" })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with progress + lives */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/" })}
          className="p-2 -ml-2 rounded-full hover:bg-secondary"
          aria-label="Esci"
        >
          <X className="size-6" />
        </button>
        <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-success transition-all"
            style={{ width: `${(idx / total) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary">
          <Heart className="size-4 text-life fill-life" />
          <span className="font-extrabold text-sm">
            {state.lives}<span className="text-muted-foreground">/{MAX_LIVES}</span>
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-md w-full px-4 py-4">
        <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
          {q.type === "clinical" ? "Caso clinico lampo" : q.type === "truefalse" ? "Vero o falso" : "Scelta multipla"}
        </div>

        {q.type === "clinical" && (
          <div className="mb-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 text-sm">
            <div className="font-extrabold text-primary mb-1">📋 Scenario</div>
            <p className="text-foreground/90">{q.scenario}</p>
          </div>
        )}

        <h2 className="text-xl font-extrabold leading-tight mb-5">
          <GlossaryText text={q.prompt} />
        </h2>

        {q.type === "truefalse" ? (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                disabled={submitted}
                onClick={() => setTfAnswer(v)}
                className={cn(
                  "btn-pop border-2 bg-card p-5 text-lg font-extrabold transition",
                  tfAnswer === v ? "border-primary bg-primary/10" : "border-border",
                  submitted && v === q.answer && "border-success bg-success/15",
                  submitted && tfAnswer === v && v !== q.answer && "border-destructive bg-destructive/10"
                )}
              >
                {v ? "✅ Vero" : "❌ Falso"}
              </button>
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const correctI = (q as Exclude<Question, { type: "truefalse" }>).correctIndex;
              const showCorrect = submitted && i === correctI;
              const showWrong = submitted && isSel && i !== correctI;
              return (
                <li key={i}>
                  <button
                    disabled={submitted}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "btn-pop w-full border-2 bg-card p-4 text-left font-bold transition flex items-center gap-3",
                      isSel ? "border-primary bg-primary/10" : "border-border",
                      showCorrect && "border-success bg-success/15",
                      showWrong && "border-destructive bg-destructive/10"
                    )}
                  >
                    <span
                      className={cn(
                        "grid place-items-center size-7 rounded-lg border-2 font-extrabold text-sm",
                        isSel ? "border-primary text-primary" : "border-border text-muted-foreground",
                        showCorrect && "border-success text-success bg-success/10",
                        showWrong && "border-destructive text-destructive bg-destructive/10"
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">
                      <GlossaryText text={opt} className="inline" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* Sticky bottom action / feedback */}
      <FeedbackPanel
        visible={!submitted}
        action={
          <Button
            className="w-full h-14 text-lg btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20"
            disabled={!isAnswerSelected()}
            onClick={handleCheck}
          >
            Verifica
          </Button>
        }
      />

      {submitted && (
        <div
          className={cn(
            "sticky bottom-0 z-20 border-t-4 animate-slide-up",
            isCorrect()
              ? "bg-success/10 border-success"
              : "bg-destructive/10 border-destructive"
          )}
        >
          <div className="mx-auto max-w-md p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-12 rounded-full grid place-items-center text-white shrink-0",
                  isCorrect() ? "bg-success" : "bg-destructive"
                )}
              >
                {isCorrect() ? <Check className="size-7" strokeWidth={3} /> : <X className="size-7" strokeWidth={3} />}
              </div>
              <div>
                <div className={cn("font-extrabold text-lg", isCorrect() ? "text-success" : "text-destructive")}>
                  {isCorrect() ? "Risposta corretta!" : "Sbagliato"}
                </div>
                {!isCorrect() && (
                  <div className="text-xs text-muted-foreground">
                    Risposta corretta:{" "}
                    <b className="text-foreground">
                      {q.type === "truefalse"
                        ? q.answer ? "Vero" : "Falso"
                        : (q as Exclude<Question, { type: "truefalse" }>).options[(q as Exclude<Question, { type: "truefalse" }>).correctIndex]}
                    </b>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-card/80 p-3 text-sm">
              <GlossaryText text={q.explanation} />
            </div>
            <Button
              className={cn(
                "w-full h-14 text-lg btn-pop text-white border-black/20",
                isCorrect() ? "bg-success hover:bg-success" : "bg-destructive hover:bg-destructive"
              )}
              onClick={handleNext}
            >
              {idx + 1 >= total ? "Termina lezione" : "Continua"}
            </Button>
          </div>
        </div>
      )}

      <NoLivesDialog
        open={showNoLives}
        onOpenChange={(o) => {
          setShowNoLives(o);
          if (!o && state.lives === 0) navigate({ to: "/" });
        }}
      />
    </div>
  );
}

function FeedbackPanel({ visible, action }: { visible: boolean; action: React.ReactNode }) {
  if (!visible) return null;
  return (
    <div className="sticky bottom-0 z-10 border-t bg-background">
      <div className="mx-auto max-w-md p-4">{action}</div>
    </div>
  );
}

function FinishScreen({
  correct,
  wrong,
  total,
  onClose,
}: {
  correct: number;
  wrong: number;
  total: number;
  onClose: () => void;
}) {
  const xpEarned = correct * 10 + (correct === total ? 20 : 0);
  const accuracy = Math.round((correct / total) * 100);
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/15 to-background flex flex-col items-center justify-center p-6 text-center">
      <div className="text-7xl animate-pop-in">{correct === total ? "🏆" : "🎉"}</div>
      <h1 className="text-3xl font-extrabold mt-4 animate-pop-in">Lezione completata!</h1>
      <p className="text-muted-foreground mt-1">Ottimo lavoro, continua così.</p>

      <div className="mt-8 w-full max-w-sm grid grid-cols-3 gap-3">
        <Stat label="XP" value={`+${xpEarned}`} accent="bg-warning/15 text-warning-foreground border-warning" icon={<Sparkles className="size-5 text-warning" />} />
        <Stat label="Precisione" value={`${accuracy}%`} accent="bg-success/15 text-success border-success" icon={<Check className="size-5 text-success" />} />
        <Stat label="Errori" value={String(wrong)} accent="bg-destructive/10 text-destructive border-destructive" icon={<X className="size-5 text-destructive" />} />
      </div>

      <Button onClick={onClose} className="mt-10 w-full max-w-sm h-14 text-lg btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20">
        <ArrowLeft className="size-5 mr-2" /> Torna al percorso
      </Button>
    </div>
  );
}

function Stat({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: React.ReactNode }) {
  return (
    <div className={"rounded-2xl border-2 p-3 " + accent}>
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-xl font-extrabold leading-none">{value}</div>
      <div className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-80">{label}</div>
    </div>
  );
}
