---
name: case-study-paw-experience
description: Full-bleed “Experience & communication” band for CaseStudyPredefinedRoles with SVG paw trails, nearest-paw hover, gradient wash, and BlurText title. Documents performance-critical patterns (module-level paw data, hovered index state only, rAF batching, memo). Use when restoring this layout, paw trails, viewport-wide paws, or avoiding paw-section jank.
---

# Predefined Roles — Paw experience section

## When to use

- Restore the **Experience & communication** block with **full-viewport-width** background, **paw-print trails**, and **nearest-paw hover** (cyan glow + drop-shadow).
- User says **paw experience**, **paw trails**, or wants this section to **break out of `max-w-[1200px]`** like the launch screenshot strip.

## Related variants

- **Minimal** (no band, no paws): `.cursor/skills/case-study-experience-section-minimal/SKILL.md`
- **Card + gradient wash** (no paws): `.cursor/skills/case-study-experience-section-card/SKILL.md`

## Location in code

- File: `src/pages/CaseStudyPredefinedRoles.tsx`
- **Outer**: plain `<section aria-labelledby="rbac-experience-heading">` (not `motion.section` on the full-bleed wrapper — avoids layout bugs with `w-screen` + translate).
- **Between**: strategy/docs column closing `</div>` and the next `max-w-[1200px]` column that starts the video section.

## Layout stack (top → bottom)

| Layer | Role | Classes / notes |
|--------|------|------------------|
| Section | Hit target for pointer + full bleed | `relative isolate z-10 mt-16 w-screen max-w-[100vw] shrink-0 left-1/2 min-w-0 -translate-x-1/2` — same breakout pattern as the launch strip |
| Gradient | Decorative wash + hairlines | `pointer-events-none absolute inset-0 -z-10 overflow-hidden`; inner rounded wash + top/bottom `h-px` gradients |
| Paw layer | SVG fills section; ref for coordinate math | `ref={experiencePawLayerRef}` `pointer-events-none absolute inset-0 z-0` |
| Content | Copy + images aligned to article | `relative z-10 w-full px-6 py-6 md:px-12 md:py-10 lg:px-16` → inner `mx-auto max-w-[1200px]` |

**Why breakout:** The case study body sits in `max-w-[1200px]`. Without `w-screen` + `left-1/2` + `-translate-x-1/2`, paws stay column-width and appear cropped at the sides.

## Module-level paw implementation (above `CaseStudyPredefinedRoles`)

Keep trail geometry **out of the component** so it is not recomputed on every render.

| Symbol | Role |
|--------|------|
| `PAW_PATH_D` | Single path `d` string for one paw glyph |
| `PAW_VIEWBOX_WIDTH` / `PAW_VIEWBOX_HEIGHT` | SVG viewBox (e.g. 1600 × 2400); must match `meet` math |
| `PAW_HOVER_PICK_RADIUS` | `130` — max distance in viewBox units to count as “near” a paw |
| `RbacExperiencePaw` | `{ x, y, r, o }` type |
| `buildRbacExperiencePaws()` | Returns all trail instances (internal `makeTrail` helper) |
| `RBAC_EXPERIENCE_PAWS` | `buildRbacExperiencePaws()` called **once** at load |
| `pickNearestRbacExperiencePawIndex(vx, vy)` | Nearest index or `null` if beyond `PAW_HOVER_PICK_RADIUS` |
| `RbacExperiencePawPaths` | `memo(function …)`; prop `hoveredPawIndex` — `number` or `null` |

Imports used for this block: `memo`, `useCallback` from `react` (in addition to existing hooks on the page).

## Performance (do not regress)

**Problems this fixes:** Storing cursor `{x,y}` in React state on every `pointermove` re-renders the **entire** case study page repeatedly. Rebuilding the `paws` array inside the SVG component on every render duplicates heavy `makeTrail` work.

**Rules:**

1. **State = hovered paw index only** — `useState<number | null>(null)`, not viewBox coordinates.
2. **Ref mirror** — `experiencePawHoveredIndexRef` stays in sync with state; the rAF flush compares `next !== experiencePawHoveredIndexRef.current` before calling `setExperiencePawHoveredIndex`.
3. **rAF batching** — `experiencePawPendingPointerRef` holds `{ cx, cy }` from the latest `pointermove`. Schedule **one** `requestAnimationFrame(flushExperiencePawHoverPick)` per frame (guard with `experiencePawRafRef`).
4. **Leave / unmount** — `onPointerLeave`: clear pending pointer, `cancelAnimationFrame` if scheduled, clear index state + ref. `useEffect` cleanup on the page component cancels a stray rAF on unmount.
5. **`memo` on `RbacExperiencePawPaths`** — Re-renders only when `hoveredPawIndex` changes.

**Anti-patterns:** Do not pass continuous hover coordinates into the SVG as props. Do not call `buildRbacExperiencePaws()` or inline `makeTrail` inside `RbacExperiencePawPaths` body.

## React state and refs (inside `CaseStudyPredefinedRoles`)

- `experiencePawHoveredIndex` / `setExperiencePawHoveredIndex`
- `experiencePawHoveredIndexRef`
- `experiencePawPendingPointerRef` — latest `clientX` / `clientY` for the rAF flush
- `experiencePawRafRef` — scheduled frame id or `null`
- `experiencePawLayerRef` — paw layer div for `getBoundingClientRect()` (must match SVG `meet` math)
- `flushExperiencePawHoverPick` — `useCallback` with `[]`; reads pending pointer + layer rect, maps to viewBox, calls `pickNearestRbacExperiencePawIndex`, updates state only when index changes

## Pointer → SVG coordinates (`xMidYMid meet`)

Must stay in sync with `preserveAspectRatio="xMidYMid meet"` on the paw `<svg>`. Run **inside** `flushExperiencePawHoverPick` (use `p.cx` / `p.cy` from the pending ref):

```ts
const r = experiencePawLayerRef.current.getBoundingClientRect();
const scale = Math.min(r.width / PAW_VIEWBOX_WIDTH, r.height / PAW_VIEWBOX_HEIGHT);
const drawnW = PAW_VIEWBOX_WIDTH * scale;
const drawnH = PAW_VIEWBOX_HEIGHT * scale;
const offsetX = r.left + (r.width - drawnW) / 2;
const offsetY = r.top + (r.height - drawnH) / 2;
const x = (p.cx - offsetX) / scale;
const y = (p.cy - offsetY) / scale;
const next = pickNearestRbacExperiencePawIndex(x, y);
```

**Section handlers (shape):**

- `onPointerMove`: write `experiencePawPendingPointerRef.current = { cx: e.clientX, cy: e.clientY }`; if `experiencePawRafRef.current == null`, assign `requestAnimationFrame(flushExperiencePawHoverPick)`.
- `onPointerLeave`: clear pending ref; cancel rAF; reset hover ref + state if needed.

Use **`meet`** (not `slice`) so tall sections do not crop the trail art horizontally.

## `RbacExperiencePawPaths` (markup summary)

- Maps **`RBAC_EXPERIENCE_PAWS`** (not a per-render array).
- Each paw: `<path d={PAW_PATH_D}>` with `transform`: `translate(x y) rotate(r) scale(2) translate(-8 -8)`.
- Hover: `hoveredPawIndex === i` → brighter opacity, `#a3e8f7` fill, `drop-shadow` on that path only.
- SVG: `opacity-75`, `text-slate-300/40`, radial `[mask-image:…]` for soft edge fade.

## Typography and motion

- Accessible title: `<h2 id="rbac-experience-heading" className="sr-only">`.
- Visible title: `BlurText` with `text-accent-readable`, word animation, `threshold={0.2}`.
- Subsections: **`motion.section`** per row with `{...fadeUp}` and staggered `transition.delay` — not on the outer full-bleed section.
- `LightboxImageButton`: `focus-visible:ring-offset-slate-900` (dark band).

## Restore workflow

1. Copy or reconcile from `src/pages/CaseStudyPredefinedRoles.tsx`: `PAW_PATH_D`, `PAW_VIEWBOX_*`, `PAW_HOVER_PICK_RADIUS`, `buildRbacExperiencePaws`, `RBAC_EXPERIENCE_PAWS`, `pickNearestRbacExperiencePawIndex`, and `RbacExperiencePawPaths` (`memo` + `hoveredPawIndex`).
2. In `CaseStudyPredefinedRoles`, restore: all paw-related refs, `flushExperiencePawHoverPick`, the rAF cleanup `useEffect`, section `onPointerMove` / `onPointerLeave`, and `<RbacExperiencePawPaths hoveredPawIndex={experiencePawHoveredIndex} />`.
3. Keep outer `<section>` classes exactly as in the layout table so paws reach **true viewport** edges inside `#main-scroll`.
4. After edits, **smoke-test**: moving the pointer across the section should feel smooth; React DevTools should **not** show constant re-renders of the page while the hovered paw stays the same.
