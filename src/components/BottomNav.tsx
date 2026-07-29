import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Home, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Percorso", Icon: Home },
  { to: "/quiz", label: "Quiz", Icon: ClipboardCheck },
  { to: "/stats", label: "Statistiche", Icon: BarChart3 },
  { to: "/profile", label: "Profilo", Icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md grid grid-cols-4">
        {items.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5"
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    "size-6 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                  strokeWidth={isActive ? 2.4 : 2}
                  fill={isActive ? "currentColor" : "none"}
                  fillOpacity={isActive ? 0.15 : 0}
                />
                <span
                  className={cn(
                    "text-[11px] font-bold transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
