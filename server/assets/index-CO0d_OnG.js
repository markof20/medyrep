import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { u as useMedStore, a as SUBJECTS, g as getNodesForSubject, i as isNodeCompleted, b as getNodeProgress, c as cn } from "./utils-ztwCBauH.js";
import { M as MedHeader, B as BottomNav } from "./BottomNav-DSOLezdl.js";
import { Target, Sparkles, Zap, Play, Crown, Trophy, Flame, Star } from "lucide-react";
import "react";
import "clsx";
import "tailwind-merge";
function rankFor(level) {
  if (level >= 10) return "Primario";
  if (level >= 7) return "Specializzando";
  if (level >= 4) return "Tirocinante";
  if (level >= 1) return "Matricola";
  return "Nuovo";
}
function HomePage() {
  const {
    state
  } = useMedStore();
  const stats = SUBJECTS.map((s) => {
    const nodes = getNodesForSubject(s.id);
    const total = nodes.length;
    const completed = nodes.filter((n) => isNodeCompleted(state, n.id)).length;
    const totalLevels = nodes.reduce((acc, n) => acc + Math.min(n.levels.length, getNodeProgress(state, n.id).completedLevels.length), 0);
    const maxLevels = nodes.reduce((acc, n) => acc + n.levels.length, 0);
    const pct = maxLevels === 0 ? 0 : Math.round(totalLevels / maxLevels * 100);
    const level = Math.floor(totalLevels / 3) + (totalLevels > 0 ? 1 : 0);
    return {
      s,
      total,
      completed,
      totalLevels,
      maxLevels,
      pct,
      level,
      rank: rankFor(level)
    };
  });
  const featured = stats.find((x) => x.totalLevels > 0 && x.pct < 100) ?? stats[0];
  const others = stats.filter((x) => x.s.id !== featured.s.id);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-24 bg-background", children: [
    /* @__PURE__ */ jsx(MedHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-md px-4 pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border-2 border-warning/40 bg-gradient-to-br from-warning/20 to-warning/5 p-4 node-shadow mb-4 flex items-center gap-3 animate-pop-in", children: [
        /* @__PURE__ */ jsx("div", { className: "grid place-items-center size-12 rounded-2xl bg-warning text-warning-foreground text-2xl shrink-0 animate-flame", children: /* @__PURE__ */ jsx(Target, { className: "size-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-extrabold uppercase tracking-wider text-warning-foreground/70", children: "Missione di oggi" }),
          /* @__PURE__ */ jsxs("div", { className: "font-extrabold text-foreground text-sm leading-tight", children: [
            "Completa 1 livello e guadagna ",
            /* @__PURE__ */ jsx("span", { className: "text-warning-foreground", children: "+50 XP" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1.5 h-1.5 rounded-full bg-warning/20 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-warning rounded-full transition-all", style: {
            width: `${Math.min(100, state.weeklyXp % 50 * 2)}%`
          } }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(FeaturedCard, { data: featured }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6 mb-3 px-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-primary" }),
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-extrabold uppercase tracking-wider text-foreground", children: "Tutte le materie" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: [
          stats.length,
          " percorsi"
        ] })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-3", children: others.map((d) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(SubjectTile, { data: d }) }, d.s.id)) })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, {})
  ] });
}
function FeaturedCard({
  data
}) {
  const {
    s,
    pct,
    level,
    rank,
    completed,
    total
  } = data;
  const isNew = data.totalLevels === 0;
  return /* @__PURE__ */ jsx(Link, { to: "/subject/$subjectId", params: {
    subjectId: s.id
  }, className: "block", children: /* @__PURE__ */ jsxs("div", { className: cn("relative overflow-hidden rounded-3xl p-5 text-primary-foreground node-shadow", "bg-gradient-to-br", s.gradient, "hover:-translate-y-0.5 active:translate-y-0.5 transition"), children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 size-40 rounded-full bg-white/15 blur-2xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -bottom-12 -left-6 size-32 rounded-full bg-black/10 blur-2xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest opacity-90", children: [
      isNew ? /* @__PURE__ */ jsx(Zap, { className: "size-3.5" }) : /* @__PURE__ */ jsx(Play, { className: "size-3.5 fill-current" }),
      isNew ? "Inizia ora" : "Continua a giocare"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-4 mt-2", children: [
      /* @__PURE__ */ jsx("div", { className: "grid place-items-center size-20 rounded-3xl bg-white/25 backdrop-blur text-5xl shrink-0 border-2 border-white/40 animate-wiggle", children: /* @__PURE__ */ jsx("span", { children: s.emoji }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-extrabold leading-tight truncate", children: s.name }),
        /* @__PURE__ */ jsx("div", { className: "text-xs opacity-90 truncate", children: s.description }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(Crown, { className: "size-3" }),
            " Lv. ",
            level
          ] }),
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider", children: rank })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider opacity-90 mb-1", children: [
        /* @__PURE__ */ jsx("span", { children: "Progresso materia" }),
        /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
          pct,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-3 rounded-full bg-black/25 overflow-hidden border border-white/20", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-warning to-white rounded-full transition-all duration-700", style: {
        width: `${pct}%`
      } }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between text-[11px] font-bold", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Trophy, { className: "size-3.5" }),
            " ",
            completed,
            "/",
            total,
            " nodi"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Flame, { className: "size-3.5 text-warning" }),
            " ",
            data.totalLevels,
            " lv"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-white text-primary px-3 py-1 font-extrabold uppercase tracking-wider text-[10px] btn-pop border-b-foreground/20", children: [
          isNew ? "Gioca" : "Riprendi",
          " →"
        ] })
      ] })
    ] })
  ] }) });
}
function SubjectTile({
  data
}) {
  const {
    s,
    pct,
    level,
    completed,
    total
  } = data;
  const r = 28;
  const C = 2 * Math.PI * r;
  const dash = C * (pct / 100);
  return /* @__PURE__ */ jsx(Link, { to: "/subject/$subjectId", params: {
    subjectId: s.id
  }, className: "block group", children: /* @__PURE__ */ jsxs("div", { className: "relative rounded-3xl border-2 bg-card p-3 node-shadow hover:-translate-y-0.5 active:translate-y-0.5 transition h-full flex flex-col items-center text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-warning text-warning-foreground text-[10px] font-extrabold px-2 py-0.5 border-2 border-card uppercase tracking-wider flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(Star, { className: "size-3 fill-current" }),
      " Lv ",
      level
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative size-20 mt-1", children: [
      /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 64 64", className: "absolute inset-0 -rotate-90", children: [
        /* @__PURE__ */ jsx("circle", { cx: "32", cy: "32", r, className: "fill-none stroke-secondary", strokeWidth: "6" }),
        /* @__PURE__ */ jsx("circle", { cx: "32", cy: "32", r, className: "fill-none stroke-primary transition-all duration-700", strokeWidth: "6", strokeLinecap: "round", strokeDasharray: C, strokeDashoffset: C - dash })
      ] }),
      /* @__PURE__ */ jsx("div", { className: cn("absolute inset-1.5 rounded-full grid place-items-center text-3xl bg-gradient-to-br text-primary-foreground", s.gradient), children: /* @__PURE__ */ jsx("span", { className: "group-hover:animate-wiggle", children: s.emoji }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 font-extrabold text-foreground text-sm leading-tight line-clamp-1 w-full", children: s.name }),
    /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: [
      completed,
      "/",
      total,
      " nodi"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 w-full flex items-center justify-center gap-1", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-1.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: cn("h-full rounded-full bg-gradient-to-r", s.gradient), style: {
        width: `${pct}%`
      } }) }),
      /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-extrabold text-muted-foreground tabular-nums w-7 text-right", children: [
        pct,
        "%"
      ] })
    ] })
  ] }) });
}
export {
  HomePage as component
};
