import { useState } from "react";
import { findGlossary } from "@/data/medContent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookOpen } from "lucide-react";

// Renders text containing [[term]] markers. Each term becomes a clickable tooltip.
export function GlossaryText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <p className={className}>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([^\]]+)\]\]$/);
        if (!m) return <span key={i}>{part}</span>;
        const term = m[1];
        return <GlossaryTerm key={i} term={term} />;
      })}
    </p>
  );
}

function GlossaryTerm({ term }: { term: string }) {
  const [open, setOpen] = useState(false);
  const entry = findGlossary(term);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline font-extrabold text-primary underline decoration-dotted underline-offset-2 hover:bg-primary/10 rounded px-0.5"
        >
          {term}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" sideOffset={6}>
        <div className="flex items-start gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold capitalize text-foreground">{term}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {entry?.definition ?? "Definizione non disponibile."}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
