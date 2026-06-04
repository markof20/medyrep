import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useMemo, useState } from "react";
import { M as MedHeader, B as BottomNav } from "./BottomNav-DSOLezdl.js";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { c as cn, u as useMedStore, f as findQuestion, N as NODES } from "./utils-ztwCBauH.js";
import { G as GlossaryText } from "./GlossaryText-CCRkGLdY.js";
import { B as Button } from "./button-DsD38-_R.js";
import { Check, X, Sparkles, BookOpen, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-popover";
import "@radix-ui/react-slot";
import "class-variance-authority";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function ReviewPage() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-24 bg-background", children: [
    /* @__PURE__ */ jsx(MedHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-md px-4 pt-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-extrabold mb-4", children: "Ripasso" }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "mistakes", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid grid-cols-2 w-full h-12 rounded-2xl", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "mistakes", className: "rounded-xl font-extrabold", children: "I miei Errori" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "cards", className: "rounded-xl font-extrabold", children: "Flashcard" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "mistakes", className: "mt-4", children: /* @__PURE__ */ jsx(MistakesTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "cards", className: "mt-4", children: /* @__PURE__ */ jsx(FlashcardsTab, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, {})
  ] });
}
function MistakesTab() {
  const {
    state,
    addXp,
    removeMistake,
    recordMistake
  } = useMedStore();
  const items = useMemo(() => state.mistakes.map((id) => findQuestion(id)).filter(Boolean), [state.mistakes]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [tf, setTf] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  if (items.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border-2 border-dashed p-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl mb-2", children: "🎯" }),
      /* @__PURE__ */ jsx("div", { className: "font-extrabold text-lg", children: "Nessun errore da ripassare" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Complimenti! Quando sbaglierai una domanda, comparirà qui per ripassarla." }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block mt-4 text-primary font-extrabold", children: "Vai al percorso →" })
    ] });
  }
  const safeIdx = Math.min(idx, items.length - 1);
  const entry = items[safeIdx];
  const q = entry.question;
  const correct = q.type === "truefalse" ? tf === q.answer : selected === q.correctIndex;
  function next(removeIfCorrect) {
    if (correct) {
      addXp(5);
      removeMistake(q.id);
    } else if (submitted && !correct) {
      recordMistake(q.id);
    }
    setSelected(null);
    setTf(null);
    setSubmitted(false);
    setIdx((i) => items.length <= 1 ? 0 : (i + 1) % items.length);
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground font-bold", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        items.length,
        " domand",
        items.length === 1 ? "a" : "e",
        " da ripassare"
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        safeIdx + 1,
        " / ",
        items.length
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card border-2 p-5 node-shadow", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-extrabold uppercase tracking-wider text-primary mb-1", children: [
        entry.node.emoji,
        " ",
        entry.node.title
      ] }),
      q.type === "clinical" && /* @__PURE__ */ jsxs("div", { className: "mb-3 rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm", children: [
        /* @__PURE__ */ jsx("b", { className: "text-primary", children: "Scenario:" }),
        " ",
        q.scenario
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-extrabold leading-tight mb-4", children: /* @__PURE__ */ jsx(GlossaryText, { text: q.prompt }) }),
      q.type === "truefalse" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: [true, false].map((v) => /* @__PURE__ */ jsx("button", { disabled: submitted, onClick: () => setTf(v), className: cn("btn-pop border-2 bg-card p-3 font-extrabold", tf === v ? "border-primary bg-primary/10" : "border-border", submitted && v === q.answer && "border-success bg-success/15", submitted && tf === v && v !== q.answer && "border-destructive bg-destructive/10"), children: v ? "Vero" : "Falso" }, String(v))) }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: q.options.map((opt, i) => {
        const isSel = selected === i;
        const correctI = q.correctIndex;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { disabled: submitted, onClick: () => setSelected(i), className: cn("btn-pop w-full border-2 bg-card p-3 text-left font-bold text-sm", isSel ? "border-primary bg-primary/10" : "border-border", submitted && i === correctI && "border-success bg-success/15", submitted && isSel && i !== correctI && "border-destructive bg-destructive/10"), children: /* @__PURE__ */ jsx(GlossaryText, { text: opt, className: "inline" }) }) }, i);
      }) }),
      submitted && /* @__PURE__ */ jsxs("div", { className: cn("mt-4 rounded-xl p-3 text-sm border-2", correct ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"), children: [
        /* @__PURE__ */ jsx("div", { className: cn("font-extrabold mb-1 flex items-center gap-1", correct ? "text-success" : "text-destructive"), children: correct ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Check, { className: "size-4" }),
          " Corretto!"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(X, { className: "size-4" }),
          " Riprova alla prossima"
        ] }) }),
        /* @__PURE__ */ jsx(GlossaryText, { text: q.explanation })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: !submitted ? /* @__PURE__ */ jsx(Button, { className: "w-full h-12 btn-pop bg-primary text-primary-foreground hover:bg-primary border-primary-foreground/20", disabled: q.type === "truefalse" ? tf === null : selected === null, onClick: () => setSubmitted(true), children: "Verifica" }) : /* @__PURE__ */ jsx(Button, { className: cn("w-full h-12 btn-pop text-white border-black/20", correct ? "bg-success hover:bg-success" : "bg-destructive hover:bg-destructive"), onClick: () => next(), children: correct ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-4 mr-1" }),
        " +5 XP · Continua"
      ] }) : "Prossima" }) })
    ] })
  ] });
}
function FlashcardsTab() {
  const {
    state
  } = useMedStore();
  const unlockedIds = useMemo(() => {
    const ids = [];
    for (let i2 = 0; i2 < NODES.length; i2++) {
      const id = NODES[i2].id;
      const prevDone = i2 === 0 || (state.nodeProgress[NODES[i2 - 1].id]?.completedLevels.length ?? 0) > 0;
      if (prevDone) ids.push(id);
    }
    return ids;
  }, [state.nodeProgress]);
  const [nodeId, setNodeId] = useState(unlockedIds[0] ?? NODES[0].id);
  const node = NODES.find((n) => n.id === nodeId);
  const cards = node.flashcards;
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (cards.length === 0) return /* @__PURE__ */ jsx("div", { className: "text-center text-muted-foreground", children: "Nessuna flashcard." });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1", children: NODES.map((n) => {
      const locked = !unlockedIds.includes(n.id);
      const active = n.id === nodeId;
      return /* @__PURE__ */ jsxs("button", { disabled: locked, onClick: () => {
        setNodeId(n.id);
        setI(0);
        setFlipped(false);
      }, className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold border-2 transition", active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border", locked && "opacity-40"), children: [
        n.emoji,
        " ",
        n.title
      ] }, n.id);
    }) }),
    /* @__PURE__ */ jsxs("button", { onClick: () => setFlipped((f) => !f), className: cn("relative w-full aspect-[4/3] rounded-3xl border-2 node-shadow p-6 flex flex-col items-center justify-center text-center transition-colors", flipped ? "bg-success/10 border-success" : "bg-card border-primary/30"), children: [
      /* @__PURE__ */ jsx(BookOpen, { className: cn("size-6 absolute top-4 left-4", flipped ? "text-success" : "text-primary") }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider font-extrabold opacity-60 mb-2", children: flipped ? "Risposta" : "Domanda" }),
      /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold leading-snug", children: flipped ? cards[i].back : cards[i].front }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 text-xs text-muted-foreground", children: "Tocca per girare" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1 h-12 btn-pop bg-card", onClick: () => {
        setI((x) => (x - 1 + cards.length) % cards.length);
        setFlipped(false);
      }, children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm font-extrabold text-muted-foreground", children: [
        i + 1,
        " / ",
        cards.length
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1 h-12 btn-pop bg-card", onClick: () => {
        setFlipped(false);
        setI((x) => (x + 1) % cards.length);
      }, children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-5" }) })
    ] }),
    /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "w-full", onClick: () => {
      setFlipped(false);
      setI(0);
    }, children: [
      /* @__PURE__ */ jsx(RotateCcw, { className: "size-4 mr-1" }),
      " Ricomincia mazzo"
    ] })
  ] });
}
export {
  ReviewPage as component
};
