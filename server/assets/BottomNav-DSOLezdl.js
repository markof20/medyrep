import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Flame, Zap, Heart, Home, RefreshCw, Trophy } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { u as useMedStore, c as cn } from "./utils-ztwCBauH.js";
import { Link } from "@tanstack/react-router";
function MedHeader() {
  const { state, MAX_LIVES } = useMedStore();
  const prevXp = useRef(state.xp);
  const [xpBump, setXpBump] = useState(0);
  const [xpDelta, setXpDelta] = useState(null);
  useEffect(() => {
    if (state.xp !== prevXp.current) {
      const diff = state.xp - prevXp.current;
      prevXp.current = state.xp;
      if (diff > 0) {
        setXpBump((n) => n + 1);
        setXpDelta(diff);
        const t = setTimeout(() => setXpDelta(null), 1e3);
        return () => clearTimeout(t);
      }
    }
  }, [state.xp]);
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-30 bg-background/85 backdrop-blur border-b", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md px-4 py-3 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary", children: [
      /* @__PURE__ */ jsx(
        Flame,
        {
          className: cn(
            "size-5 text-streak fill-streak",
            state.streak > 0 && "animate-flame"
          )
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "font-extrabold text-foreground", children: state.streak })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary", children: [
      /* @__PURE__ */ jsx(
        Zap,
        {
          className: cn("size-5 text-warning fill-warning", xpBump > 0 && "animate-xp-bump")
        },
        xpBump
      ),
      /* @__PURE__ */ jsx("span", { className: "font-extrabold text-foreground tabular-nums", children: state.xp }),
      xpDelta !== null && /* @__PURE__ */ jsxs(
        "span",
        {
          className: "pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-extrabold text-warning-foreground bg-warning px-1.5 py-0.5 rounded-full animate-xp-float shadow-md",
          children: [
            "+",
            xpDelta
          ]
        },
        `d-${xpBump}`
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary", children: [
      /* @__PURE__ */ jsx(Heart, { className: "size-5 text-life fill-life" }),
      /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-foreground", children: [
        state.lives,
        /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground font-bold", children: [
          "/",
          MAX_LIVES
        ] })
      ] })
    ] })
  ] }) });
}
const items = [
  { to: "/", label: "Percorso", Icon: Home },
  { to: "/review", label: "Ripasso", Icon: RefreshCw },
  { to: "/leaderboard", label: "Classifica", Icon: Trophy }
];
function BottomNav() {
  return /* @__PURE__ */ jsx("nav", { className: "fixed bottom-0 inset-x-0 z-30 bg-background border-t", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-md grid grid-cols-3", children: items.map(({ to, label, Icon }) => /* @__PURE__ */ jsx(
    Link,
    {
      to,
      activeOptions: { exact: true },
      className: "flex flex-col items-center gap-1 py-2.5 text-muted-foreground data-[status=active]:text-primary",
      children: ({ isActive }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "p-2 rounded-2xl transition-colors " + (isActive ? "bg-primary/10" : ""),
            children: /* @__PURE__ */ jsx(Icon, { className: "size-6 " + (isActive ? "stroke-[2.5]" : "") })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: label })
      ] })
    },
    to
  )) }) });
}
export {
  BottomNav as B,
  MedHeader as M
};
