---
name: case-study-detail-section-card
description: >-
  Default glass panel backgrounds for case study detail pages (in-page sections):
  use `case-study-card` with `case-study-card--no-left-accent` for large bands like
  Scope; keep portfolio listing cards on full `case-study-card` with cyan left bar
  and hover. Use when adding or restoring section panels on CaseStudyPredefinedRoles
  or similar detail routes, or when matching Scope/collaboration styling.
---

# Case study detail page — default section card backgrounds

## When to use

- Building or restoring **in-page sections** on a **case study detail** route (e.g. `CaseStudyPredefinedRoles.tsx`) that should match the **glass “case study card” look** from the portfolio grid **without** the listing affordances (cyan left accent, hover glow).
- User asks to match **Scope & collaboration** panel styling, **detail page default card backgrounds**, or **no hover on section cards**.

## Do not use for

- **Portfolio / case study listing** cards — those stay on **`CaseStudyCard`** with full **`.case-study-card`** (cyan left bar + hover). File: `src/components/CaseStudyCard.tsx`.

## CSS source of truth

All rules live in **`src/styles.css`**.

| Class | Role |
|--------|------|
| **`.case-study-card`** | Base glass: gradient fill, slate border, **3px cyan left** `border-left`, backdrop blur, default + **`:hover`** (stronger shadow, `0 0 32px` cyan glow, brighter gradient). |
| **`.case-study-card--no-left-accent`** | **Modifier** (must be combined with `.case-study-card`): uniform **1px** slate border on all sides — **no cyan bar**. |
| **`.case-study-card.case-study-card--no-left-accent:hover`** | Re-applies the **same** border, gradient, and `box-shadow` as the **resting** base card so **`.case-study-card:hover` does not apply** (no glow, no lift). |

If you change the base `.case-study-card` visuals, update the **no-left-accent `:hover`** block so it stays pixel-aligned with the resting glass treatment (or intentional drift).

## Detail page: recommended markup

**Large section panel (example: Scope & collaboration)**

- Classes: `case-study-card case-study-card--no-left-accent relative mt-16 rounded-xl p-6 md:p-8`
- **Omit** `transition-all duration-300` — hover is static; transitions only add work for no visual gain.
- Use on a **`motion.section`** (or `section`) with `aria-labelledby` as needed.

```tsx
<motion.section
  {...fadeUp}
  transition={{ duration: 0.4, delay: 0.1 }}
  aria-labelledby="rbac-scope-heading"
  className="case-study-card case-study-card--no-left-accent relative mt-16 rounded-xl p-6 md:p-8"
>
```

## Detail page: hero column (Problem / Solution / Goals)

Use the **same** glass treatment as Scope, with **`p-5`**:

`case-study-card case-study-card--no-left-accent rounded-xl p-5`

Also use **`case-study-card case-study-card--no-left-accent`** for the **DigitalOcean launch CTA** strip and the **peer feedback** inner panel (with their existing flex / `relative mt-8` / padding utilities).

## Checklist for new detail sections

1. Prefer **`case-study-card case-study-card--no-left-accent`** for **detail in-page panels** (Scope band, hero Problem/Solution/Goals, launch CTA, peer feedback card) — same glass as portfolio cards, **no** cyan bar or hover glow.
2. Keep **`CaseStudyCard`** / plain **`.case-study-card`** on **index/listing** only (cyan bar + hover).
3. After editing **`src/styles.css`**, verify **listing cards** still hover correctly and **detail sections** show **no** cyan bar and **no** hover glow.

## Related skills

- **Experience band variants:** `case-study-experience-section-minimal`, `case-study-experience-section-card`, `case-study-paw-experience`.
