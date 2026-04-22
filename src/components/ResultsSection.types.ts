import type { ReactNode } from "react";

export type ResultNumberFormat =
  | "int"
  | "int-plus"
  | "int-tilde"
  | "percent"
  | "approx-percent";

export type ResultsStat = {
  value: number;
  format: ResultNumberFormat;
  label: string;
  /** Optional smaller line under the metric label (e.g. a later update). */
  subLabel?: ReactNode;
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

