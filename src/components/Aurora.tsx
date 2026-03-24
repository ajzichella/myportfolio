import React from "react";

type AuroraProps = {
  color1: string;
  color2: string;
  color3: string;
  className?: string;
};

export function Aurora({ color1, color2, color3, className = "" }: AuroraProps) {
  return (
    <div className={`aurora pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <div
        className="aurora-layer aurora-layer-a"
        style={{ ["--aurora-color" as string]: color1 } as React.CSSProperties}
      />
      <div
        className="aurora-layer aurora-layer-b"
        style={{ ["--aurora-color" as string]: color2 } as React.CSSProperties}
      />
      <div
        className="aurora-layer aurora-layer-c"
        style={{ ["--aurora-color" as string]: color3 } as React.CSSProperties}
      />
    </div>
  );
}

