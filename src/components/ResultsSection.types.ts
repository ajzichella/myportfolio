import type { ReactNode } from "react";

export type ResultNumberFormat = "int-plus" | "percent" | "approx-percent";

export type ResultsStat = {
  value: number;
  format: ResultNumberFormat;
  label: string;
};

export type ResultsSectionProps = {
  headingId: string;
  badgeLabel?: string;
  title?: string;
  description: ReactNode;
  stats: ResultsStat[];
  sectionClassName?: string;
  sectionDelay?: number;
  inViewAmount?: number;
};

