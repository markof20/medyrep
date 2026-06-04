import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Heart, Infinity, Sparkles } from "lucide-react";
import { c as cn, u as useMedStore } from "./utils-ztwCBauH.js";
import { B as Button } from "./button-DsD38-_R.js";
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function NoLivesDialog({ open, onOpenChange }) {
  const { refillLives } = useMedStore();
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-sm rounded-3xl", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "items-center text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "size-20 rounded-full bg-life/10 grid place-items-center mb-2", children: /* @__PURE__ */ jsx(Heart, { className: "size-10 text-life fill-life" }) }),
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl", children: "Vite esaurite!" }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        "Hai finito le vite. Le vite si rigenerano nel tempo, oppure passa a ",
        /* @__PURE__ */ jsx("b", { children: "MedRep Plus" }),
        " per averle infinite."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border-2 border-warning bg-warning/10 p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Infinity, { className: "size-7 text-warning-foreground" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-extrabold", children: "Vite Infinite" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Studia senza limiti, 4,99€/mese" })
        ] }),
        /* @__PURE__ */ jsx(Sparkles, { className: "size-5 text-warning" })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          className: "w-full btn-pop bg-warning text-warning-foreground hover:bg-warning border-warning-foreground/20 h-12 text-base",
          onClick: () => onOpenChange(false),
          children: "Scopri Plus"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          className: "w-full",
          onClick: () => {
            refillLives();
            onOpenChange(false);
          },
          children: "Usa una ricarica gratuita (demo)"
        }
      )
    ] })
  ] }) });
}
export {
  NoLivesDialog as N
};
