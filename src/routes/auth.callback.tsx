import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate({ to: "/profile", replace: true });
      return;
    }
    // Fallback: se la sessione non arriva entro 8s (auth fallita), torna alla home.
    const t = setTimeout(() => navigate({ to: "/", replace: true }), 8000);
    return () => clearTimeout(t);
  }, [session, navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">
      Accesso in corso…
    </div>
  );
}
