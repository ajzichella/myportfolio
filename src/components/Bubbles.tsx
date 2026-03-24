import React from "react";

const BUBBLE_CONFIG = [
  { size: 220, left: "6%", top: "38%", color: "rgba(59,130,246,0.56)", delay: "-2s", duration: "20s" },
  { size: 260, left: "38%", top: "-4%", color: "rgba(20,184,166,0.54)", delay: "-6s", duration: "24s" },
  { size: 250, left: "52%", top: "24%", color: "rgba(6,182,212,0.5)", delay: "-10s", duration: "26s" },
  { size: 200, left: "34%", top: "66%", color: "rgba(245,158,11,0.54)", delay: "-8s", duration: "22s" },
  { size: 220, left: "72%", top: "76%", color: "rgba(249,115,22,0.58)", delay: "-12s", duration: "25s" },
  { size: 180, left: "22%", top: "80%", color: "rgba(168,85,247,0.54)", delay: "-15s", duration: "23s" },
];

export function Bubbles({ className = "inset-0" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      {BUBBLE_CONFIG.map((bubble, i) => (
        <span
          key={`bubble-${i}`}
          className="bubbles-orb absolute rounded-full blur-2xl"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            top: bubble.top,
            background: `radial-gradient(circle, ${bubble.color} 0%, rgba(255,255,255,0.14) 36%, rgba(255,255,255,0) 70%)`,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
    </div>
  );
}
