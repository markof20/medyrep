import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  pickLevelQuestions,
  getNodeById,
  getLevel,
  getSubjectByNodeId,
  LEVELS_PER_NODE,
  type Question,
} from "@/data/medContent";
import { getNodeProgress, useMedStore } from "@/lib/medStore";
import { Button } from "@/components/ui/button";
import { GlossaryText } from "@/components/GlossaryText";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { ArrowLeft, Check, Heart, X, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lesson/$nodeId/$levelId")({
  component: LessonPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Livello non trovato.{" "}
      <Link to="/" className="text-primary underline">
        Torna al percorso
      </Link>
    </div>
  ),
});

function LessonPage() {
  const { nodeId, levelId } = Route.useParams();
  const navigate = useNavigate();
  const node = useMemo(() => getNodeById(nodeId), [nodeId]);
  const level = useMemo(() => getLevel(nodeId, levelId), [nodeId, levelId]);
  const subject = useMemo(() => getSubjectByNodeId(nodeId), [nodeId]);

  const backTo = () => {
    if (node) {
      navigate({ to: "/node/$nodeId", params: { nodeId: node.id } });
    } else {
      navigate({ to: "/" });
    }
  };

  const { state, addXp, loseLife, recordMistake, finishLevel, MAX_LIVES } = useMedStore();

  const questions = useMemo(() => {
    if (!node || !level) return [] as Question[];
    return pickLevelQuestions(node.id, level.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, levelId]);

  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tfChoice, setTfChoice] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [sessionCorrectIds, setSessionCorrectIds] = useState<string[]>([]);
  const [showNoLives, setShowNoLives] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (state.lives === 0 && !done) setShowNoLives(true);
  }, [state.lives, done]);

  if (!node || !level || total === 0) return null;

  const q = questions[idx];
  const correctIndex =
    q.type === "multiple" || q.type === "clinical" || q.type === "cloze" ? q.correctIndex : null;

  function isAnswerSelected() {
    return q.type === "truefalse" ? tfChoice !== null : selected !== null;
  }
  function isCorrect(): boolean {
    if (q.type === "truefalse") return tfChoice === q.answer;
    if (correctIndex === null) return false;
    return selected === correctIndex;
  }

  function handleCheck() {
    if (!isAnswerSelected()) return;
    setSubmitted(true);
    const ok = isCorrect();
    if (ok) {
      setCorrectCount((c) => c + 1);
      setSessionCorrectIds((arr) => [...arr, q.id]);
      addXp(10);
    } else {
      setWrongCount((c) => c + 1);
      loseLife();
      recordMistake(q.id);
    }
  }

  function handleNext() {
    if (idx + 1 >= total) {
      finishLevel(node!.id, level!.id, sessionCorrectIds);
      if (correctCount === total) addXp(20);
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setTfChoice(null);
    setSubmitted(false);
  }

  if (done) {
    const np = getNodeProgress(state, node.id);
    return (
      <FinishScreen
        correct={correctCount}
        wrong={wrongCount}
        total={total}
        completedLevels={Math.min(LEVELS_PER_NODE, np.completedLevels.length)}
        totalLevels={LEVELS_PER_NODE}
        onClose={backTo}
      />
    );
  }

  const typeLabel =
    q.type === "clinical"
      ? "Caso clinico"
      : q.type === "cloze"
        ? "Riempi lo spazio"
        : q.type === "truefalse"
          ? "Vero o Falso"
          : "Scelta multipla";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur px-4 py-3 flex items-center gap-3">
        <button onClick={backTo} className="p-2 -ml-2 rounded-full hover:bg-secondary" aria-label="Esci">
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
            {state.lives}
            <span className="text-muted-foreground">/{MAX_LIVES}</span>
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-md w-full px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            {level.title} · {typeLabel}
          </div>
          <div className="text-xs font-extrabold text-muted-foreground">
            {idx + 1} / {total}
          </div>
        </div>

        {q.type === "clinical" && (
          <div className="mb-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 text-sm">
            <div className="font-extrabold text-primary mb-1">📋 Scenario</div>
            <p className="text-foreground/90">{q.scenario}</p>
          </div>
        )}

        {q.type === "cloze" ? (
          <ClozePrompt prompt={q.prompt} />
        ) : (
          <h2 className="text-xl font-extrabold leading-tight mb-5">
            <GlossaryText text={q.prompt} />
          </h2>
        )}

        {q.type === "truefalse" ? (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((v) => {
              const isSel = tfChoice === v;
              const showCorrect = submitted && v === q.answer;
              const showWrong = submitted && tfChoice === v && v !== q.answer;
              return (
                <button
                  key={String(v)}
                  disabled={submitted}
                  onClick={() => setTfChoice(v)}
                  className={cn(
                    "btn-pop border-2 bg-card p-4 font-extrabold text-lg",
                    isSel ? "border-primary bg-primary/10" : "border-border",
                    showCorrect && "border-success bg-success/15",
                    showWrong && "border-destructive bg-destructive/10",
                  )}
                >
                  {v ? "Vero" : "Falso"}
                </button>
              );
            })}
          </div>
        ) : (
          <ul className={cn("space-y-3", q.type === "cloze" && "grid grid-cols-2 gap-3 space-y-0")}>
            {(q as Exclude<Question, { type: "truefalse" }>).options.map((opt, i) => {
              const isSel = selected === i;
              const showCorrect = submitted && correctIndex === i;
              const showWrong = submitted && isSel && i !== correctIndex;
              return (
                <li key={i}>
                  <button
                    disabled={submitted}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "btn-pop w-full border-2 bg-card p-4 text-left font-bold transition flex items-center gap-3",
                      q.type === "cloze" && "justify-center text-center",
                      isSel ? "border-primary bg-primary/10" : "border-border",
                      showCorrect && "border-success bg-success/15",
                      showWrong && "border-destructive bg-destructive/10",
                    )}
                  >
                    {q.type !== "cloze" && (
                      <span
                        className={cn(
                          "grid place-items-center size-7 rounded-lg border-2 font-extrabold text-sm shrink-0",
                          isSel ? "border-primary text-primary" : "border-border text-muted-foreground",
                          showCorrect && "border-success text-success bg-success/10",
                          showWrong && "border-destructive text-destructive bg-destructive/10",
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                    )}
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

      {!submitted && (
        <div className="sticky bottom-0 z-10 border-t bg-background">
          <div className="mx-auto max-w-md p-4">
            <Button
              className="w-full h-14 text-lg btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20"
              disabled={!isAnswerSelected()}
              onClick={handleCheck}
            >
              Verifica
            </Button>
          </div>
        </div>
      )}

      {submitted && (
        <div
          className={cn(
            "sticky bottom-0 z-20 border-t-4 animate-slide-up",
            isCorrect() ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive",
          )}
        >
          <div className="mx-auto max-w-md p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-12 rounded-full grid place-items-center text-white shrink-0",
                  isCorrect() ? "bg-success" : "bg-destructive",
                )}
              >
                {isCorrect() ? (
                  <Check className="size-7" strokeWidth={3} />
                ) : (
                  <X className="size-7" strokeWidth={3} />
                )}
              </div>
              <div>
                <div
                  className={cn(
                    "font-extrabold text-lg",
                    isCorrect() ? "text-success" : "text-destructive",
                  )}
                >
                  {isCorrect() ? "Risposta corretta!" : "Sbagliato"}
                </div>
                {!isCorrect() && q.type !== "truefalse" && correctIndex !== null && (
                  <div className="text-xs text-muted-foreground">
                    Risposta corretta:{" "}
                    <b className="text-foreground">
                      {(q as Exclude<Question, { type: "truefalse" }>).options[correctIndex]}
                    </b>
                  </div>
                )}
                {!isCorrect() && q.type === "truefalse" && (
                  <div className="text-xs text-muted-foreground">
                    Risposta corretta: <b className="text-foreground">{q.answer ? "Vero" : "Falso"}</b>
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
                isCorrect() ? "bg-success hover:bg-success" : "bg-destructive hover:bg-destructive",
              )}
              onClick={handleNext}
            >
              {idx + 1 >= total ? "Termina livello" : "Continua"}
            </Button>
          </div>
        </div>
      )}

      <NoLivesDialog
        open={showNoLives}
        onOpenChange={(o) => {
          setShowNoLives(o);
          if (!o && state.lives === 0) backTo();
        }}
      />
    </div>
  );
}

function ClozePrompt({ prompt }: { prompt: string }) {
  const parts = prompt.split("___");
  return (
    <h2 className="text-xl font-extrabold leading-tight mb-5">
      {parts.map((p, i) => (
        <span key={i}>
          <GlossaryText text={p} className="inline" />
          {i < parts.length - 1 && (
            <span className="inline-block align-middle mx-1 px-3 py-0.5 rounded-md border-2 border-dashed border-primary/60 bg-primary/10 text-primary">
              ____
            </span>
          )}
        </span>
      ))}
    </h2>
  );
}

function FinishScreen({
  correct,
  wrong,
  total,
  completedLevels,
  totalLevels,
  onClose,
}: {
  correct: number;
  wrong: number;
  total: number;
  completedLevels: number;
  totalLevels: number;
  onClose: () => void;
}) {
  const xpEarned = correct * 10 + (correct === total ? 20 : 0);
  const accuracy = Math.round((correct / total) * 100);
  const nodeDone = completedLevels >= totalLevels;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/15 to-background flex flex-col items-center justify-center p-6 text-center">
      <div className="text-7xl animate-pop-in">{nodeDone ? "🏆" : correct === total ? "🌟" : "🎉"}</div>
      <h1 className="text-3xl font-extrabold mt-4 animate-pop-in">
        {nodeDone ? "Nodo padroneggiato!" : "Livello completato!"}
      </h1>
      <p className="text-muted-foreground mt-1">
        {nodeDone
          ? "Hai completato tutti i livelli di questo nodo."
          : `${completedLevels} di ${totalLevels} livelli completati.`}
      </p>

      <div className="mt-6 flex items-center gap-2">
        {Array.from({ length: totalLevels }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-8 transition",
              i < completedLevels ? "text-warning fill-warning" : "text-muted-foreground/30",
            )}
            strokeWidth={2.5}
          />
        ))}
      </div>

      <div className="mt-8 w-full max-w-sm grid grid-cols-3 gap-3">
        <Stat
          label="XP"
          value={`+${xpEarned}`}
          accent="bg-warning/15 text-warning-foreground border-warning"
          icon={<Sparkles className="size-5 text-warning" />}
        />
        <Stat
          label="Precisione"
          value={`${accuracy}%`}
          accent="bg-success/15 text-success border-success"
          icon={<Check className="size-5 text-success" />}
        />
        <Stat
          label="Errori"
          value={String(wrong)}
          accent="bg-destructive/10 text-destructive border-destructive"
          icon={<X className="size-5 text-destructive" />}
        />
      </div>

      <Button
        onClick={onClose}
        className="mt-10 w-full max-w-sm h-14 text-lg btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20"
      >
        <ArrowLeft className="size-5 mr-2" /> Torna al nodo
      </Button>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={"rounded-2xl border-2 p-3 " + accent}>
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-xl font-extrabold leading-none">{value}</div>
      <div className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-80">{label}</div>
    </div>
  );
}
