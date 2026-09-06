"use client";

const POSITIONS = [
  { top: "8%", left: "12%", size: 18, delay: 0, opacity: 0.35 },
  { top: "18%", left: "82%", size: 14, delay: 0.4, opacity: 0.25 },
  { top: "72%", left: "8%", size: 16, delay: 0.8, opacity: 0.3 },
  { top: "85%", left: "78%", size: 20, delay: 1.2, opacity: 0.3 },
  { top: "40%", left: "92%", size: 12, delay: 0.6, opacity: 0.2 },
  { top: "55%", left: "4%", size: 12, delay: 1, opacity: 0.25 },
];

export function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {POSITIONS.map((p, i) => (
        <span
          key={i}
          className="absolute animate-pulse"
          style={{
            top: p.top,
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: "3.5s",
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
