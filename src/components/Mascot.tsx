import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Medy — la mascotte di MedRep: un cuore con camice e stetoscopio.
 * Disegnata inline in SVG così eredita currentColor, scala senza asset
 * e può cambiare posa senza caricare immagini diverse.
 */
export type MascotPose =
  | "wave" // saluta con la mano alzata — home
  | "idle" // braccia lungo i fianchi — banner neutri
  | "think" // mano al mento — suggerimenti / quiz
  | "cheer"; // entrambe le braccia in alto — traguardi

export function Mascot({
  pose = "idle",
  className,
  animate = true,
  title,
}: {
  pose?: MascotPose;
  className?: string;
  animate?: boolean;
  title?: string;
}) {
  // Più mascotte possono coesistere nella stessa pagina: gli id dei gradienti
  // devono restare unici, altrimenti l'HTML non è valido.
  const uid = useId().replace(/:/g, "");
  const bodyId = `medy-body-${uid}`;
  const coatId = `medy-coat-${uid}`;

  return (
    <svg
      viewBox="0 0 120 130"
      className={cn("select-none", animate && "animate-mascot-float", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4645F" />
          <stop offset="100%" stopColor="#E23B36" />
        </linearGradient>
        <linearGradient id={coatId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8EEF7" />
        </linearGradient>
      </defs>

      {/* ---------- gambe ---------- */}
      <g stroke="#C7302C" strokeWidth="6" strokeLinecap="round">
        <path d="M48 104 L46 116" />
        <path d="M72 104 L74 116" />
      </g>
      <ellipse cx="43" cy="119" rx="9" ry="5.5" fill="#2F3B54" />
      <ellipse cx="77" cy="119" rx="9" ry="5.5" fill="#2F3B54" />

      {/* ---------- corpo a cuore ---------- */}
      <path
        d="M60 108C60 108 16 80 16 48C16 30 29 19 43 19C51 19 57 23 60 29C63 23 69 19 77 19C91 19 104 30 104 48C104 80 60 108 60 108Z"
        fill={`url(#${bodyId})`}
      />
      {/* luce in alto a sinistra */}
      <path
        d="M31 29C25 34 22 41 22 49C22 52 22.5 55 23.5 58C20 47 22 36 31 29Z"
        fill="#FFFFFF"
        opacity="0.35"
      />

      {/* ---------- camice ---------- */}
      <path
        d="M60 63C51 63 43 68 39 76C36 82 35 89 35 95C35 98 37 100 40 100H80C83 100 85 98 85 95C85 89 84 82 81 76C77 68 69 63 60 63Z"
        fill={`url(#${coatId})`}
      />
      {/* revers del camice */}
      <path d="M60 63L49 78L54 66Z" fill="#D6DEEA" />
      <path d="M60 63L71 78L66 66Z" fill="#D6DEEA" />
      {/* bottoni */}
      <circle cx="60" cy="82" r="2" fill="#B9C4D4" />
      <circle cx="60" cy="91" r="2" fill="#B9C4D4" />
      {/* taschino */}
      <rect x="70" y="84" width="10" height="8" rx="1.5" fill="#E3EAF4" />

      {/* ---------- stetoscopio ---------- */}
      <path
        d="M48 66C46 78 52 86 60 86C68 86 74 78 72 66"
        fill="none"
        stroke="#2F6BD8"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="88" r="5" fill="#2F6BD8" />
      <circle cx="60" cy="88" r="2.4" fill="#8FB6F2" />

      {/* ---------- faccia ---------- */}
      <g fill="#2F3B54">
        <ellipse cx="48" cy="45" rx="4" ry="5" />
        <ellipse cx="72" cy="45" rx="4" ry="5" />
      </g>
      <circle cx="49.4" cy="43.2" r="1.5" fill="#FFFFFF" />
      <circle cx="73.4" cy="43.2" r="1.5" fill="#FFFFFF" />
      {/* guance */}
      <ellipse cx="39" cy="53" rx="5" ry="3.5" fill="#FF9A96" opacity="0.75" />
      <ellipse cx="81" cy="53" rx="5" ry="3.5" fill="#FF9A96" opacity="0.75" />
      {/* sorriso */}
      <path
        d="M52 55C55 59 65 59 68 55"
        fill="none"
        stroke="#2F3B54"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ---------- braccia (variano con la posa) ---------- */}
      <Arms pose={pose} animate={animate} />
    </svg>
  );
}

function Arms({ pose, animate }: { pose: MascotPose; animate: boolean }) {
  const stroke = {
    stroke: "#E23B36",
    strokeWidth: 7,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  const hand = "#F4645F";

  if (pose === "wave") {
    return (
      <>
        <path d="M40 76C33 76 28 72 26 66" {...stroke} />
        <circle cx="24" cy="63" r="6" fill={hand} />
        {/* braccio che saluta: ruota attorno alla spalla destra */}
        <g
          className={animate ? "animate-mascot-wave" : undefined}
          style={{ transformOrigin: "80px 74px" }}
        >
          <path d="M80 76C88 74 93 68 94 60" {...stroke} />
          <circle cx="95" cy="56" r="6.5" fill={hand} />
        </g>
      </>
    );
  }

  if (pose === "think") {
    return (
      <>
        <path d="M40 76C33 77 28 73 26 67" {...stroke} />
        <circle cx="24" cy="64" r="6" fill={hand} />
        {/* mano portata al mento */}
        <path d="M80 78C84 72 80 64 72 60" {...stroke} />
        <circle cx="70" cy="58" r="6" fill={hand} />
      </>
    );
  }

  if (pose === "cheer") {
    return (
      <g className={animate ? "animate-mascot-cheer" : undefined}>
        <path d="M40 76C31 72 26 64 26 55" {...stroke} />
        <circle cx="25" cy="51" r="6.5" fill={hand} />
        <path d="M80 76C89 72 94 64 94 55" {...stroke} />
        <circle cx="95" cy="51" r="6.5" fill={hand} />
      </g>
    );
  }

  return (
    <>
      <path d="M40 76C33 78 29 84 29 90" {...stroke} />
      <circle cx="28" cy="93" r="6" fill={hand} />
      <path d="M80 76C87 78 91 84 91 90" {...stroke} />
      <circle cx="92" cy="93" r="6" fill={hand} />
    </>
  );
}
