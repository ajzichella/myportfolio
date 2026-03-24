---
name: case-study-experience-section-minimal
description: Default “Experience & communication” block for CaseStudyPredefinedRoles — no full-bleed band, no inner card; max-width column, page background shows through, black focus ring offsets. Use when restoring or keeping this layout.
---

# Predefined Roles — Experience section (minimal / aligned)

## When to use

- You want **Experience & communication** to **match the rest of the case study** with **no extra background** (no tinted strip, no glass card, no `BlobBackground` / Aurora on this band).
- After experimenting with variants, **restore the minimal layout** by following this skill or asking to apply **`case-study-experience-section-minimal`**.

## Related variants

- For the **saved card + gradient wash** treatment instead, see `.cursor/skills/case-study-experience-section-card/SKILL.md`.
- For **full-bleed paw trails + BlurText** (“paw experience”), see `.cursor/skills/case-study-paw-experience/SKILL.md`.

## Location in code

- File: `src/pages/CaseStudyPredefinedRoles.tsx`
- Anchor: `motion.section` with `aria-labelledby="rbac-experience-heading"` (between the strategy/docs column and the video section).

## Design summary

| Piece | Classes / notes |
|--------|------------------|
| Outer `motion.section` | `relative z-10 mt-16 w-full min-w-0` — **no** `bg-*`, **no** `border-y`, **no** decorative absolute layers |
| Content wrapper | `relative z-[1] mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-16` (same rhythm as other case-study columns) |
| H2 | `{sectionTitle}` |
| H3 | `text-lg font-semibold text-white` |
| Body | `mt-3 … text-[#999999] md:text-lg` |
| Figcaption | `text-sm … text-slate-400` |
| Grids | `mt-10` / `mt-12`, `lg:grid-cols-[…]` as in file (invite, assign, comms) |
| `LightboxImageButton` | `wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-black"` |

**Intentionally omitted:** section-specific `BlobBackground`, `Aurora`, full-bleed borders, inner `rounded-2xl` panel, radial washes, cream/light bands.

## Motion

- ` {...fadeUp}` on the outer `motion.section`
- `transition={{ duration: 0.4, delay: 0.15 }}` (or match siblings)

## Restore snippet (structure)

Replace the `rbac-experience-heading` `motion.section` with the live pattern below; keep `base`, `fadeUp`, `sectionTitle`, `setImageLightbox`, and update copy from the repo if it has changed.

```tsx
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.15 }}
          aria-labelledby="rbac-experience-heading"
          className="relative z-10 mt-16 w-full min-w-0"
        >
          <div className="relative z-[1] mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-16">
            <h2 id="rbac-experience-heading" className={sectionTitle}>
              Experience &amp; communication
            </h2>
            {/* three subsections: rbac-invite-role-heading, rbac-assign-role-heading, rbac-role-comms-heading */}
          </div>
        </motion.section>
```

For the full three grids + figures + figcaption, copy from `CaseStudyPredefinedRoles.tsx` or from `case-study-experience-section-card/SKILL.md` and **strip** all outer/card/gradient wrappers and **set** `ring-offset-black` on each `LightboxImageButton`.
