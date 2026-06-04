import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { a as SUBJECTS, g as getNodesForSubject, u as useMedStore, d as LEVELS_PER_NODE, e as isReviewNode, c as cn, h as isNodeUnlocked, b as getNodeProgress, i as isNodeCompleted } from "./utils-ztwCBauH.js";
import { M as MedHeader, B as BottomNav } from "./BottomNav-DSOLezdl.js";
import { N as NoLivesDialog } from "./NoLivesDialog-Da6MyXpk.js";
import { ArrowLeft, Star, Check, Brain, Lock } from "lucide-react";
import { R as Route } from "./router-Dr03-RO0.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "./button-DsD38-_R.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@tanstack/react-query";
function SubjectPage() {
  const {
    subjectId
  } = Route.useParams();
  const navigate = useNavigate();
  const subject = useMemo(() => SUBJECTS.find((s) => s.id === subjectId), [subjectId]);
  const nodes = useMemo(() => getNodesForSubject(subjectId), [subjectId]);
  const {
    state
  } = useMedStore();
  const nodeIds = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const [showNoLives, setShowNoLives] = useState(false);
  if (!subject) {
    return /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
      "Materia non trovata.",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-primary underline", children: "Torna alle materie" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-24 bg-background", children: [
    /* @__PURE__ */ jsx(MedHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-md px-4 pt-4", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/"
      }), className: "flex items-center gap-1 text-sm font-extrabold text-muted-foreground mb-3 hover:text-foreground", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
        " Materie"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn("rounded-3xl bg-gradient-to-br text-primary-foreground p-5 node-shadow mb-6", subject.gradient), children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl mb-1", children: subject.emoji }),
        /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-wider opacity-80", children: "Materia" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-extrabold mt-0.5", children: subject.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90 mt-1", children: subject.description }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 text-[11px] font-extrabold uppercase tracking-wider opacity-90", children: [
          nodes.filter((n) => !isReviewNode(n)).length,
          " nodi · ",
          LEVELS_PER_NODE,
          " livelli ciascuno · ripasso ogni 4"
        ] })
      ] }),
      /* @__PURE__ */ jsx("ol", { className: "relative pt-2 pb-6", children: nodes.map((node, idx) => {
        const group = Math.floor(idx / 5);
        const pos = idx % 5;
        const side = group % 2 === 0 ? 1 : -1;
        const baseOffsets = [60, 100, 100, 60, 0];
        const dx = baseOffsets[pos] * (pos === 4 ? 0 : side);
        const isLast = idx === nodes.length - 1;
        const review = isReviewNode(node);
        const totalLevels = node.levels.length;
        const unlocked = isNodeUnlocked(state, nodeIds, node.id);
        const np = getNodeProgress(state, node.id);
        const completed = isNodeCompleted(state, node.id);
        const doneLevels = np.completedLevels.length;
        const pct = Math.round(doneLevels / totalLevels * 100);
        const reviewGradient = "from-warning to-warning/70";
        const nodeGradient = review ? reviewGradient : subject.gradient;
        const standardIdx = nodes.slice(0, idx + 1).filter((n) => !isReviewNode(n)).length;
        const reviewIdx = nodes.slice(0, idx + 1).filter((n) => isReviewNode(n)).length;
        const Body = /* @__PURE__ */ jsxs("div", { className: cn("relative flex flex-col items-center gap-1 transition", unlocked && "hover:-translate-y-0.5 active:translate-y-0.5", !unlocked && "opacity-60"), children: [
          !review && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5 mb-0.5", children: Array.from({
            length: totalLevels
          }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: cn("size-2.5", i < doneLevels ? "text-warning fill-warning" : "text-muted-foreground/30"), strokeWidth: 2.5 }, i)) }),
          review && /* @__PURE__ */ jsx("div", { className: "mb-0.5 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warning/20 text-warning-foreground", children: "Ripasso" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 -rotate-90", viewBox: "0 0 80 80", width: "80", height: "80", children: [
              /* @__PURE__ */ jsx("circle", { cx: "40", cy: "40", r: "36", fill: "none", className: "stroke-secondary", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("circle", { cx: "40", cy: "40", r: "36", fill: "none", className: cn(completed ? "stroke-success" : review ? "stroke-warning" : "stroke-primary"), strokeWidth: "4", strokeLinecap: "round", strokeDasharray: 2 * Math.PI * 36, strokeDashoffset: 2 * Math.PI * 36 * (1 - pct / 100), style: {
                transition: "stroke-dashoffset 500ms"
              } })
            ] }),
            /* @__PURE__ */ jsx("div", { className: cn("grid place-items-center size-20 rounded-full text-3xl bg-gradient-to-br text-primary-foreground node-shadow border-4 border-background", completed ? "from-success to-success/70" : nodeGradient, review && !completed && "ring-4 ring-warning/30"), children: unlocked ? completed ? /* @__PURE__ */ jsx(Check, { className: "size-9", strokeWidth: 3 }) : review ? /* @__PURE__ */ jsx(Brain, { className: "size-9", strokeWidth: 2.5 }) : /* @__PURE__ */ jsx("span", { children: node.emoji }) : /* @__PURE__ */ jsx(Lock, { className: "size-7" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center mt-1 px-2 max-w-[180px]", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground", children: review ? `Ripasso ${reviewIdx}` : `Nodo ${standardIdx}` }),
            /* @__PURE__ */ jsx("div", { className: "font-extrabold text-sm text-foreground leading-tight truncate", children: node.title })
          ] })
        ] });
        return /* @__PURE__ */ jsxs("li", { className: "relative flex flex-col items-center", style: {
          transform: `translateX(${dx}px)`,
          marginTop: idx === 0 ? 0 : 8
        }, children: [
          !unlocked ? /* @__PURE__ */ jsx("button", { onClick: () => {
            if (state.lives === 0) setShowNoLives(true);
          }, children: Body }) : /* @__PURE__ */ jsx(Link, { to: "/node/$nodeId", params: {
            nodeId: node.id
          }, children: Body }),
          !isLast && /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "my-2 h-6 w-1.5 rounded-full bg-muted-foreground/20", style: {
            backgroundImage: "repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 8px)",
            color: "hsl(var(--muted-foreground) / 0.35)",
            background: "none"
          } })
        ] }, node.id);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center text-xs text-muted-foreground", children: [
        "Hai padroneggiato ",
        nodes.filter((n) => isNodeCompleted(state, n.id)).length,
        "/",
        nodes.length,
        " nodi"
      ] })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, {}),
    /* @__PURE__ */ jsx(NoLivesDialog, { open: showNoLives, onOpenChange: setShowNoLives })
  ] });
}
export {
  SubjectPage as component
};
