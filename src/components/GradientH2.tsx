import React from "react";
import GradientText from "./GradientText";

const gradientH2Props = {
  colors: ["#7ee8ff", "#00aeef", "#006b8f"],
  direction: "diagonal" as const,
  animationSpeed: 3,
};

type GradientH2Props = {
  id?: string;
  /** Typography only (sizes/weight); gradient supplies color. */
  className: string;
  children: React.ReactNode;
};

/** Section &lt;h2&gt; with the same animated gradient as the hero name / Case Studies. */
export function GradientH2({ id, className, children }: GradientH2Props) {
  return (
    <h2 id={id} className="inline-block min-w-0">
      <GradientText {...gradientH2Props} className={className}>
        {children}
      </GradientText>
    </h2>
  );
}
