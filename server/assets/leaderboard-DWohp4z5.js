import { jsxs, jsx } from "react/jsx-runtime";
import { M as MedHeader, B as BottomNav } from "./BottomNav-DSOLezdl.js";
import { u as useMedStore, L as LEADERBOARD, S as SUBJECT, c as cn } from "./utils-ztwCBauH.js";
import { Trophy, Medal, Crown } from "lucide-react";
import "react";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
function LeaderboardPage() {
  const {
    state
  } = useMedStore();
  const me = {
    name: "Tu",
    xp: state.weeklyXp,
    avatar: "🧑‍🎓",
    isMe: true
  };
  const merged = [...LEADERBOARD.map((u) => ({
    ...u,
    isMe: false
  })), me].sort((a, b) => b.xp - a.xp).map((u, i) => ({
    ...u,
    rank: i + 1
  }));
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-24 bg-background", children: [
    /* @__PURE__ */ jsx(MedHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-md px-4 pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-gradient-to-br from-warning to-warning/60 text-warning-foreground p-5 node-shadow mb-6 text-center", children: [
        /* @__PURE__ */ jsx(Trophy, { className: "size-10 mx-auto mb-1" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-extrabold", children: "Classifica settimanale" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: SUBJECT.faculty }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs font-extrabold opacity-80", children: "Si resetta ogni lunedì" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 items-end mb-6", children: [merged[1], merged[0], merged[2]].map((u, idx) => {
        const heights = ["h-20", "h-28", "h-16"];
        const colors = ["bg-muted-foreground/30", "bg-warning", "bg-streak/60"];
        const icons = [/* @__PURE__ */ jsx(Medal, { className: "size-5" }, "2"), /* @__PURE__ */ jsx(Crown, { className: "size-6" }, "1"), /* @__PURE__ */ jsx(Medal, { className: "size-5" }, "3")];
        return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl mb-1", children: u.avatar }),
          /* @__PURE__ */ jsx("div", { className: cn("text-xs font-extrabold truncate max-w-full", u.isMe && "text-primary"), children: u.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground font-bold", children: [
            u.xp,
            " XP"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: cn("w-full mt-1 rounded-t-2xl text-white grid place-items-center", colors[idx], heights[idx]), children: [
            icons[idx],
            /* @__PURE__ */ jsx("div", { className: "font-extrabold", children: u.rank })
          ] })
        ] }, u.rank);
      }) }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: merged.slice(3).map((u) => /* @__PURE__ */ jsxs("li", { className: cn("flex items-center gap-3 rounded-2xl border-2 p-3", u.isMe ? "border-primary bg-primary/10" : "border-border bg-card"), children: [
        /* @__PURE__ */ jsx("div", { className: "size-8 grid place-items-center rounded-full bg-secondary font-extrabold text-sm", children: u.rank }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl", children: u.avatar }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 font-extrabold", children: u.name }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 text-warning-foreground bg-warning/20 px-2 py-1 rounded-full", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-extrabold", children: [
          u.xp,
          " XP"
        ] }) })
      ] }, u.name + u.rank)) })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, {})
  ] });
}
export {
  LeaderboardPage as component
};
