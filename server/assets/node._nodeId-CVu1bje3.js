import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { j as getNodeById, k as getSubjectByNodeId, u as useMedStore, b as getNodeProgress, d as LEVELS_PER_NODE, Q as QUESTIONS_PER_LEVEL, c as cn, l as isLevelUnlocked, m as isLevelCompleted } from "./utils-ztwCBauH.js";
import { M as MedHeader, B as BottomNav } from "./BottomNav-DSOLezdl.js";
import { N as NoLivesDialog } from "./NoLivesDialog-Da6MyXpk.js";
import { ArrowLeft, Check, Lock, Play } from "lucide-react";
import { a as Route } from "./router-Dr03-RO0.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "./button-DsD38-_R.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@tanstack/react-query";
function NodePage() {
  const {
    nodeId
  } = Route.useParams();
  const navigate = useNavigate();
  const node = useMemo(() => getNodeById(nodeId), [nodeId]);
  const subject = useMemo(() => getSubjectByNodeId(nodeId), [nodeId]);
  const {
    state
  } = useMedStore();
  const [showNoLives, setShowNoLives] = useState(false);
  if (!subject || !node) {
    return /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
      "Nodo non trovato.",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-primary underline", children: "Torna alle materie" })
    ] });
  }
  const levelIds = node.levels.map((l) => l.id);
  const np = getNodeProgress(state, node.id);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-24 bg-background", children: [
    /* @__PURE__ */ jsx(MedHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-md px-4 pt-4", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => subject ? navigate({
        to: "/subject/$subjectId",
        params: {
          subjectId: subject.id
        }
      }) : navigate({
        to: "/"
      }), className: "flex items-center gap-1 text-sm font-extrabold text-muted-foreground mb-3 hover:text-foreground", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
        " ",
        subject.name
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn("rounded-3xl bg-gradient-to-br text-primary-foreground p-5 node-shadow mb-6", subject.gradient), children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl mb-1", children: node.emoji }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold uppercase tracking-wider opacity-80", children: [
          subject.name,
          " · Nodo"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-extrabold mt-0.5", children: node.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90 mt-1", children: node.subtitle }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 text-[11px] font-extrabold uppercase tracking-wider opacity-90", children: [
          np.completedLevels.length,
          "/",
          LEVELS_PER_NODE,
          " livelli · ",
          QUESTIONS_PER_LEVEL,
          " domande per livello"
        ] })
      ] }),
      /* @__PURE__ */ jsx("ol", { className: "space-y-3", children: node.levels.map((lvl, idx) => {
        const unlocked = isLevelUnlocked(state, node.id, levelIds, lvl.id);
        const completed = isLevelCompleted(state, node.id, lvl.id);
        const Body = /* @__PURE__ */ jsxs("div", { className: cn("relative w-full rounded-3xl border-2 bg-card p-4 node-shadow flex items-center gap-4 transition animate-pop-in", unlocked && "hover:-translate-y-0.5 active:translate-y-0.5", !unlocked && "opacity-70"), children: [
          /* @__PURE__ */ jsx("div", { className: cn("grid place-items-center size-12 rounded-2xl text-lg font-extrabold shrink-0", completed ? "bg-success text-success-foreground" : unlocked ? "bg-gradient-to-br text-primary-foreground " + subject.gradient : "bg-locked text-white"), children: completed ? /* @__PURE__ */ jsx(Check, { className: "size-6", strokeWidth: 3 }) : unlocked ? /* @__PURE__ */ jsxs("span", { children: [
            "L",
            idx + 1
          ] }) : /* @__PURE__ */ jsx(Lock, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground", children: [
              "Livello ",
              idx + 1
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-extrabold text-foreground leading-tight truncate", children: lvl.title }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              QUESTIONS_PER_LEVEL,
              " domande · misto quiz, V/F, casi"
            ] })
          ] }),
          unlocked && !completed && /* @__PURE__ */ jsx("div", { className: "grid place-items-center size-9 rounded-full bg-primary text-primary-foreground shrink-0", children: /* @__PURE__ */ jsx(Play, { className: "size-4 fill-current" }) })
        ] });
        if (!unlocked) {
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => {
            if (state.lives === 0) setShowNoLives(true);
          }, className: "w-full text-left", children: Body }) }, lvl.id);
        }
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/lesson/$nodeId/$levelId", params: {
          nodeId: node.id,
          levelId: lvl.id
        }, className: "block", children: Body }) }, lvl.id);
      }) })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, {}),
    /* @__PURE__ */ jsx(NoLivesDialog, { open: showNoLives, onOpenChange: setShowNoLives })
  ] });
}
export {
  NodePage as component
};
