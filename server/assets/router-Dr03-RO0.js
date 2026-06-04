import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
const appCss = "/medyrep/assets/styles-fIzf7RUV.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$6 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#3b82f6" },
      { title: "MedRep — Micro-apprendimento per medicina" },
      { name: "description", content: "App mobile-first gamificata per studenti di medicina: quiz, casi clinici, flashcard, classifica. Funziona offline." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "MedRep — Micro-apprendimento per medicina" },
      { property: "og:description", content: "App mobile-first gamificata per studenti di medicina: quiz, casi clinici, flashcard, classifica. Funziona offline." },
      { name: "twitter:title", content: "MedRep — Micro-apprendimento per medicina" },
      { name: "twitter:description", content: "App mobile-first gamificata per studenti di medicina: quiz, casi clinici, flashcard, classifica. Funziona offline." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b9cddb88-700e-4374-95b0-8ef53c11a27b/id-preview-25e484a5--b7424072-ddc5-4cb9-8e60-a55f62a5b320.lovable.app-1779369616602.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b9cddb88-700e-4374-95b0-8ef53c11a27b/id-preview-25e484a5--b7424072-ddc5-4cb9-8e60-a55f62a5b320.lovable.app-1779369616602.png" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$6.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$5 = () => import("./review-Bm3SFvkF.js");
const Route$5 = createFileRoute("/review")({
  head: () => ({
    meta: [{
      title: "Ripasso — MedRep"
    }, {
      name: "description",
      content: "Ripassa i tuoi errori e usa le flashcard per fissare i concetti."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./leaderboard-DWohp4z5.js");
const Route$4 = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [{
      title: "Classifica settimanale — MedRep"
    }, {
      name: "description",
      content: "Sfida i tuoi colleghi di facoltà nella classifica XP settimanale."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-CO0d_OnG.js");
const Route$3 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "MedRep — Materie di medicina, micro-apprendimento gamificato"
    }, {
      name: "description",
      content: "Studia medicina materia per materia: 5 materie, 20 nodi per materia, 5 livelli per nodo. Quiz, casi clinici, XP e streak."
    }, {
      property: "og:title",
      content: "MedRep — Studia medicina, livello per livello"
    }, {
      property: "og:description",
      content: "Percorsi a nodi e livelli su più materie, con vite, XP e classifica globale."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitNotFoundComponentImporter$2 = () => import("./subject._subjectId-Vj4bopNO.js");
const $$splitComponentImporter$2 = () => import("./subject._subjectId-bQlDhTm1.js");
const Route$2 = createFileRoute("/subject/$subjectId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent")
});
const $$splitNotFoundComponentImporter$1 = () => import("./node._nodeId-BrbteoMm.js");
const $$splitComponentImporter$1 = () => import("./node._nodeId-CVu1bje3.js");
const Route$1 = createFileRoute("/node/$nodeId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
const $$splitNotFoundComponentImporter = () => import("./lesson._nodeId._levelId-1LyTVkyK.js");
const $$splitComponentImporter = () => import("./lesson._nodeId._levelId-DPZP5VTa.js");
const Route = createFileRoute("/lesson/$nodeId/$levelId")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const ReviewRoute = Route$5.update({
  id: "/review",
  path: "/review",
  getParentRoute: () => Route$6
});
const LeaderboardRoute = Route$4.update({
  id: "/leaderboard",
  path: "/leaderboard",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const SubjectSubjectIdRoute = Route$2.update({
  id: "/subject/$subjectId",
  path: "/subject/$subjectId",
  getParentRoute: () => Route$6
});
const NodeNodeIdRoute = Route$1.update({
  id: "/node/$nodeId",
  path: "/node/$nodeId",
  getParentRoute: () => Route$6
});
const LessonNodeIdLevelIdRoute = Route.update({
  id: "/lesson/$nodeId/$levelId",
  path: "/lesson/$nodeId/$levelId",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  LeaderboardRoute,
  ReviewRoute,
  NodeNodeIdRoute,
  SubjectSubjectIdRoute,
  LessonNodeIdLevelIdRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$2 as R,
  Route$1 as a,
  Route as b,
  router as r
};
