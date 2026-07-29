import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { supabase, supabaseEnabled } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { LogIn, LogOut } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profilo — MedRep" }] }),
  component: ProfilePage,
});

const AVATAR_CHOICES = ["🧑‍⚕️", "👩‍⚕️", "👨‍⚕️", "🧑🏽‍⚕️", "👩🏻‍⚕️", "🧑🏾‍⚕️", "👩🏼‍⚕️", "🧑🏻‍⚕️"];

function ProfilePage() {
  const { session, profile, loading, signInWithGoogle, signOut, refreshProfile } = useAuth();

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4 space-y-4">
        {!supabaseEnabled ? (
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-center text-sm text-muted-foreground">
            Login non configurato: imposta VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
          </div>
        ) : loading ? (
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-center text-sm text-muted-foreground">
            Caricamento…
          </div>
        ) : !session ? (
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground p-6 node-shadow text-center">
            <h1 className="text-2xl font-extrabold mb-2">Accedi con Google</h1>
            <p className="text-sm opacity-90 mb-5">
              Salva i tuoi progressi, entra in classifica e aggiungi amici.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="w-full font-extrabold"
              onClick={signInWithGoogle}
            >
              <LogIn className="size-4" /> Continua con Google
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border-2 border-border bg-card p-5 text-center">
              <div className="text-5xl mb-2">{profile?.avatar_emoji ?? "🧑‍⚕️"}</div>
              <div className="font-extrabold text-lg">{profile?.display_name}</div>
              <div className="text-sm text-muted-foreground">{session.user.email}</div>
            </div>

            <AvatarPicker
              current={profile?.avatar_emoji ?? "🧑‍⚕️"}
              onPick={async (emoji) => {
                if (!supabase || !session) return;
                const { error } = await supabase
                  .from("profiles")
                  .update({ avatar_emoji: emoji })
                  .eq("id", session.user.id);
                if (error) toast.error("Impossibile aggiornare l'avatar");
                else await refreshProfile();
              }}
            />

            <Button variant="outline" className="w-full font-extrabold" onClick={signOut}>
              <LogOut className="size-4" /> Esci
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function AvatarPicker({ current, onPick }: { current: string; onPick: (emoji: string) => void }) {
  const [pending, setPending] = useState<string | null>(null);

  return (
    <div>
      <div className="text-xs font-extrabold text-muted-foreground mb-2">Scegli avatar</div>
      <div className="grid grid-cols-4 gap-2">
        {AVATAR_CHOICES.map((emoji) => (
          <button
            key={emoji}
            type="button"
            disabled={pending !== null}
            onClick={async () => {
              setPending(emoji);
              await onPick(emoji);
              setPending(null);
            }}
            className={cn(
              "text-2xl rounded-2xl border-2 p-2 grid place-items-center transition-colors",
              current === emoji ? "border-primary bg-primary/10" : "border-border bg-card",
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
