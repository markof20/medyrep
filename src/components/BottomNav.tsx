import { Link } from "@tanstack/react-router";
import { Home, RefreshCw, Trophy } from "lucide-react";

const items = [
  { to: "/", label: "Percorso", Icon: Home },
  { to: "/review", label: "Ripasso", Icon: RefreshCw },
  { to: "/leaderboard", label: "Classifica", Icon: Trophy },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-background border-t">
      <div className="mx-auto max-w-md grid grid-cols-3">
        {items.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex flex-col items-center gap-1 py-2.5 text-muted-foreground data-[status=active]:text-primary"
          >
            {({ isActive }) => (
              <>
                <div
                  className={
                    "p-2 rounded-2xl transition-colors " +
                    (isActive ? "bg-primary/10" : "")
                  }
                >
                  <Icon className={"size-6 " + (isActive ? "stroke-[2.5]" : "")} />
                </div>
                <span className="text-xs font-bold">{label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
