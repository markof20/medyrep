import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { c as cn, o as findGlossary } from "./utils-ztwCBauH.js";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { BookOpen } from "lucide-react";
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
function GlossaryText({ text, className }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return /* @__PURE__ */ jsx("p", { className, children: parts.map((part, i) => {
    const m = part.match(/^\[\[([^\]]+)\]\]$/);
    if (!m) return /* @__PURE__ */ jsx("span", { children: part }, i);
    const term = m[1];
    return /* @__PURE__ */ jsx(GlossaryTerm, { term }, i);
  }) });
}
function GlossaryTerm({ term }) {
  const [open, setOpen] = useState(false);
  const entry = findGlossary(term);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "inline font-extrabold text-primary underline decoration-dotted underline-offset-2 hover:bg-primary/10 rounded px-0.5",
        children: term
      }
    ) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-72", sideOffset: 6, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(BookOpen, { className: "size-4" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "font-extrabold capitalize text-foreground", children: term }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: entry?.definition ?? "Definizione non disponibile." })
      ] })
    ] }) })
  ] });
}
export {
  GlossaryText as G
};
