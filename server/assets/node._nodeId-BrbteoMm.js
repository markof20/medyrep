import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
const SplitNotFoundComponent = () => /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
  "Nodo non trovato.",
  " ",
  /* @__PURE__ */ jsx(Link, { to: "/", className: "text-primary underline", children: "Torna alle materie" })
] });
export {
  SplitNotFoundComponent as notFoundComponent
};
