import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { j as getNodeById, n as getLevel, u as useMedStore, p as pickLevelQuestions, b as getNodeProgress, d as LEVELS_PER_NODE, c as cn } from "./utils-ztwCBauH.js";
import { B as Button } from "./button-DsD38-_R.js";
import { G as GlossaryText } from "./GlossaryText-CCRkGLdY.js";
import { N as NoLivesDialog } from "./NoLivesDialog-Da6MyXpk.js";
import { X, Heart, Check, Star, Sparkles, ArrowLeft } from "lucide-react";
import { b as Route } from "./router-Dr03-RO0.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-popover";
import "@radix-ui/react-dialog";
import "@tanstack/react-query";
function LessonPage() {
  const {
    nodeId,
    levelId
  } = Route.useParams();
  const navigate = useNavigate();
  const node = useMemo(() => getNodeById(nodeId), [nodeId]);
  const level = useMemo(() => getLevel(nodeId, levelId), [nodeId, levelId]);
  const backTo = () => {
    if (node) {
      navigate({
        to: "/node/$nodeId",
        params: {
          nodeId: node.id
        }
      });
    } else {
      navigate({
        to: "/"
      });
    }
  };
  const {
    state,
    addXp,
    loseLife,
    recordMistake,
    finishLevel,
    MAX_LIVES
  } = useMedStore();
  const questions = useMemo(() => {
    if (!node || !level) return [];
    return pickLevelQuestions(node.id, level.id);
  }, [nodeId, levelId]);
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [tfChoice, setTfChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [sessionCorrectIds, setSessionCorrectIds] = useState([]);
  const [showNoLives, setShowNoLives] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (state.lives === 0 && !done) setShowNoLives(true);
  }, [state.lives, done]);
  if (!node || !level || total === 0) return null;
  const q = questions[idx];
  const correctIndex = q.type === "multiple" || q.type === "clinical" || q.type === "cloze" ? q.correctIndex : null;
  function isAnswerSelected() {
    return q.type === "truefalse" ? tfChoice !== null : selected !== null;
  }
  function isCorrect() {
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
      finishLevel(node.id, level.id, sessionCorrectIds);
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
    return /* @__PURE__ */ jsx(FinishScreen, { correct: correctCount, wrong: wrongCount, total, completedLevels: Math.min(LEVELS_PER_NODE, np.completedLevels.length), totalLevels: LEVELS_PER_NODE, onClose: backTo });
  }
  const typeLabel = q.type === "clinical" ? "Caso clinico" : q.type === "cloze" ? "Riempi lo spazio" : q.type === "truefalse" ? "Vero o Falso" : "Scelta multipla";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-20 bg-background/90 backdrop-blur px-4 py-3 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("button", { onClick: backTo, className: "p-2 -ml-2 rounded-full hover:bg-secondary", "aria-label": "Esci", children: /* @__PURE__ */ jsx(X, { className: "size-6" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-3 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-success transition-all", style: {
        width: `${idx / total * 100}%`
      } }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded-full bg-secondary", children: [
        /* @__PURE__ */ jsx(Heart, { className: "size-4 text-life fill-life" }),
        /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-sm", children: [
          state.lives,
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            "/",
            MAX_LIVES
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 mx-auto max-w-md w-full px-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-extrabold uppercase tracking-wider text-muted-foreground", children: [
          level.title,
          " · ",
          typeLabel
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-extrabold text-muted-foreground", children: [
          idx + 1,
          " / ",
          total
        ] })
      ] }),
      q.type === "clinical" && /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 text-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "font-extrabold text-primary mb-1", children: "📋 Scenario" }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground/90", children: q.scenario })
      ] }),
      q.type === "cloze" ? /* @__PURE__ */ jsx(ClozePrompt, { prompt: q.prompt }) : /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold leading-tight mb-5", children: /* @__PURE__ */ jsx(GlossaryText, { text: q.prompt }) }),
      q.type === "truefalse" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [true, false].map((v) => {
        const isSel = tfChoice === v;
        const showCorrect = submitted && v === q.answer;
        const showWrong = submitted && tfChoice === v && v !== q.answer;
        return /* @__PURE__ */ jsx("button", { disabled: submitted, onClick: () => setTfChoice(v), className: cn("btn-pop border-2 bg-card p-4 font-extrabold text-lg", isSel ? "border-primary bg-primary/10" : "border-border", showCorrect && "border-success bg-success/15", showWrong && "border-destructive bg-destructive/10"), children: v ? "Vero" : "Falso" }, String(v));
      }) }) : /* @__PURE__ */ jsx("ul", { className: cn("space-y-3", q.type === "cloze" && "grid grid-cols-2 gap-3 space-y-0"), children: q.options.map((opt, i) => {
        const isSel = selected === i;
        const showCorrect = submitted && correctIndex === i;
        const showWrong = submitted && isSel && i !== correctIndex;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { disabled: submitted, onClick: () => setSelected(i), className: cn("btn-pop w-full border-2 bg-card p-4 text-left font-bold transition flex items-center gap-3", q.type === "cloze" && "justify-center text-center", isSel ? "border-primary bg-primary/10" : "border-border", showCorrect && "border-success bg-success/15", showWrong && "border-destructive bg-destructive/10"), children: [
          q.type !== "cloze" && /* @__PURE__ */ jsx("span", { className: cn("grid place-items-center size-7 rounded-lg border-2 font-extrabold text-sm shrink-0", isSel ? "border-primary text-primary" : "border-border text-muted-foreground", showCorrect && "border-success text-success bg-success/10", showWrong && "border-destructive text-destructive bg-destructive/10"), children: String.fromCharCode(65 + i) }),
          /* @__PURE__ */ jsx("span", { className: "flex-1", children: /* @__PURE__ */ jsx(GlossaryText, { text: opt, className: "inline" }) })
        ] }) }, i);
      }) })
    ] }),
    !submitted && /* @__PURE__ */ jsx("div", { className: "sticky bottom-0 z-10 border-t bg-background", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-md p-4", children: /* @__PURE__ */ jsx(Button, { className: "w-full h-14 text-lg btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20", disabled: !isAnswerSelected(), onClick: handleCheck, children: "Verifica" }) }) }),
    submitted && /* @__PURE__ */ jsx("div", { className: cn("sticky bottom-0 z-20 border-t-4 animate-slide-up", isCorrect() ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"), children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: cn("size-12 rounded-full grid place-items-center text-white shrink-0", isCorrect() ? "bg-success" : "bg-destructive"), children: isCorrect() ? /* @__PURE__ */ jsx(Check, { className: "size-7", strokeWidth: 3 }) : /* @__PURE__ */ jsx(X, { className: "size-7", strokeWidth: 3 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: cn("font-extrabold text-lg", isCorrect() ? "text-success" : "text-destructive"), children: isCorrect() ? "Risposta corretta!" : "Sbagliato" }),
          !isCorrect() && q.type !== "truefalse" && correctIndex !== null && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Risposta corretta:",
            " ",
            /* @__PURE__ */ jsx("b", { className: "text-foreground", children: q.options[correctIndex] })
          ] }),
          !isCorrect() && q.type === "truefalse" && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Risposta corretta: ",
            /* @__PURE__ */ jsx("b", { className: "text-foreground", children: q.answer ? "Vero" : "Falso" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-card/80 p-3 text-sm", children: /* @__PURE__ */ jsx(GlossaryText, { text: q.explanation }) }),
      /* @__PURE__ */ jsx(Button, { className: cn("w-full h-14 text-lg btn-pop text-white border-black/20", isCorrect() ? "bg-success hover:bg-success" : "bg-destructive hover:bg-destructive"), onClick: handleNext, children: idx + 1 >= total ? "Termina livello" : "Continua" })
    ] }) }),
    /* @__PURE__ */ jsx(NoLivesDialog, { open: showNoLives, onOpenChange: (o) => {
      setShowNoLives(o);
      if (!o && state.lives === 0) backTo();
    } })
  ] });
}
function ClozePrompt({
  prompt
}) {
  const parts = prompt.split("___");
  return /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold leading-tight mb-5", children: parts.map((p, i) => /* @__PURE__ */ jsxs("span", { children: [
    /* @__PURE__ */ jsx(GlossaryText, { text: p, className: "inline" }),
    i < parts.length - 1 && /* @__PURE__ */ jsx("span", { className: "inline-block align-middle mx-1 px-3 py-0.5 rounded-md border-2 border-dashed border-primary/60 bg-primary/10 text-primary", children: "____" })
  ] }, i)) });
}
function FinishScreen({
  correct,
  wrong,
  total,
  completedLevels,
  totalLevels,
  onClose
}) {
  const xpEarned = correct * 10 + (correct === total ? 20 : 0);
  const accuracy = Math.round(correct / total * 100);
  const nodeDone = completedLevels >= totalLevels;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-b from-primary/15 to-background flex flex-col items-center justify-center p-6 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "text-7xl animate-pop-in", children: nodeDone ? "🏆" : correct === total ? "🌟" : "🎉" }),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold mt-4 animate-pop-in", children: nodeDone ? "Nodo padroneggiato!" : "Livello completato!" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: nodeDone ? "Hai completato tutti i livelli di questo nodo." : `${completedLevels} di ${totalLevels} livelli completati.` }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex items-center gap-2", children: Array.from({
      length: totalLevels
    }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: cn("size-8 transition", i < completedLevels ? "text-warning fill-warning" : "text-muted-foreground/30"), strokeWidth: 2.5 }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 w-full max-w-sm grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(Stat, { label: "XP", value: `+${xpEarned}`, accent: "bg-warning/15 text-warning-foreground border-warning", icon: /* @__PURE__ */ jsx(Sparkles, { className: "size-5 text-warning" }) }),
      /* @__PURE__ */ jsx(Stat, { label: "Precisione", value: `${accuracy}%`, accent: "bg-success/15 text-success border-success", icon: /* @__PURE__ */ jsx(Check, { className: "size-5 text-success" }) }),
      /* @__PURE__ */ jsx(Stat, { label: "Errori", value: String(wrong), accent: "bg-destructive/10 text-destructive border-destructive", icon: /* @__PURE__ */ jsx(X, { className: "size-5 text-destructive" }) })
    ] }),
    /* @__PURE__ */ jsxs(Button, { onClick: onClose, className: "mt-10 w-full max-w-sm h-14 text-lg btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "size-5 mr-2" }),
      " Torna al nodo"
    ] })
  ] });
}
function Stat({
  label,
  value,
  accent,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border-2 p-3 " + accent, children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-1", children: icon }),
    /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold leading-none", children: value }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase font-bold tracking-wider mt-1 opacity-80", children: label })
  ] });
}
export {
  LessonPage as component
};
