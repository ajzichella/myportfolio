---
name: home-kind-words-postit-notes
description: >-
  Home “Kind words” testimonials as sticky post-its: Caveat handwriting, black
  text, bright paper colors, tape pseudo-element, tilt, optional hug width,
  hearts background, section heading matches other Home h2s. Use when restoring
  or extending this treatment, or matching it elsewhere.
---

# Home — Kind words as post-it notes (saved baseline)

## When to use

- Reverting **Kind words** to the **post-it** look after experiments.
- Adding another testimonial: extend **`kindWordsTestimonials`**, **`KIND_WORDS_POSTITS`** (same length), and grid placement if needed.
- Recreating **sticky-note testimonials** on another page with the same visual system.

For the **older ink-style glass cards** + drift grid, see **`home-kind-words-section`** (separate skill).

## Design contracts

| Rule | Detail |
|------|--------|
| **Body & attribution** | **`text-black`** on the `<article>` (Tailwind). Do not use colored “ink” hexes on text; contrast stays consistent on all pad colors. |
| **Font** | **Caveat** for post-it content only. Load via Google Fonts in **`index.html`** next to Inter; **`tailwind.config.js`** → `fontFamily.caveat`. |
| **Section title** | Same as other Home sections: **`text-2xl font-bold text-white md:text-3xl`** (Inter, not Caveat). |
| **Attribution** | Single line after quotes: **`- First L, title`** (hyphen + space). No top border / rule above the name. |
| **Tape** | Implemented as **`.kind-words-postit::before`** in **`src/styles.css`** (sized strip, semi-transparent white gradient). |
| **Motion** | Per-note **`rotate`** from config; **`useReducedMotion()`** from `motion/react` omits `transform` on the article when reduced motion is preferred. |

## Files

| Piece | Location |
|--------|-----------|
| Section, data, post-it config, hearts | **`src/pages/Home.tsx`** |
| `.kind-words-postit`, tape, hearts track animation | **`src/styles.css`** |
| Heart float animation | **`src/styles.css`** — `.peer-feedback-heart` (shared with case study peer feedback) |
| Caveat font | **`index.html`** Google Fonts URL |
| `font-caveat` | **`tailwind.config.js`** `theme.extend.fontFamily` |

## Data shapes

**`KIND_WORDS_POSTITS`** (one entry per testimonial, same order as **`kindWordsTestimonials`**):

```ts
// Example — adjust bg/rotate; add hug for a short single-paragraph note
const KIND_WORDS_POSTITS = [
  { bg: "#f2e45a", rotate: "-2.8deg" },
  { bg: "#f5a3c8", rotate: "2.1deg", hug: true },
  { bg: "#86e9a8", rotate: "-1.6deg" },
] as const;
```

- **`bg`**: pad fill only (vibrant yellow / pink / green style).
- **`rotate`**: string for CSS `rotate(...)`.
- **`hug`**: optional; **`true`** → `w-full max-w-[min(100%,19rem)] sm:w-fit sm:max-w-[22rem]` so the note shrinks to content (used for the short quote).

**`KIND_WORDS_HEARTS`**: Same 10 entries as case study **`PEER_FEEDBACK_HEARTS`** (`CaseStudyPredefinedRoles.tsx`). **`KindWordsHeartHalf`** renders half the tiled field; two halves inside **`kind-words-hearts-track`** with **`height: 200%`** for seamless vertical scroll.

## Section markup (baseline)

1. **`<section id="kind-words">`**: `relative isolate overflow-hidden`, standard horizontal padding; **no** top border.
2. **Hearts layer**: `absolute inset-0`, **`opacity` ~0.32**, vertical **mask** (fade top/bottom), inner **`kind-words-hearts-track`** with two **`KindWordsHeartHalf`** layers.
3. **Content**: `max-w-[1200px]`, **h2** matches other Home section titles.
4. **Grid**: `lg:grid-cols-2`; note 0 **start**, note 1 **end**, note 2 **`lg:col-span-2`** centered. **No** `kind-words-cards-drift` on this grid (tilt is enough).
5. **`motion.div`** wrapper per note (entrance animation); **`article.kind-words-postit`** with **`text-black`**, **`style={{ backgroundColor, transform? }}`**.

## CSS reference (`src/styles.css`)

Copy/paste if restoring after edits:

```css
/* Kind words: sticky post-it notes (handwriting + bright paper). */
.kind-words-postit {
  font-family: "Caveat", cursive;
  border-radius: 3px;
  box-shadow:
    1px 2px 0 rgba(0, 0, 0, 0.07),
    3px 5px 0 rgba(0, 0, 0, 0.05),
    5px 12px 22px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.32);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.kind-words-postit::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: 48%;
  max-width: 8.25rem;
  height: 13px;
  transform: translate(-50%, -42%);
  border-radius: 1px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.2) 100%
  );
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  pointer-events: none;
}

.kind-words-postit:hover {
  box-shadow:
    1px 2px 0 rgba(0, 0, 0, 0.09),
    4px 7px 0 rgba(0, 0, 0, 0.04),
    7px 18px 32px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
```

Hearts track + **`@media (prefers-reduced-motion: reduce)`** for **`kind-words-hearts-track`** remain as in the **`home-kind-words-section`** skill (same keyframes).

## Checklist

- [ ] `article` has **`text-black`** (and no per-note text color overrides).
- [ ] **`KIND_WORDS_POSTITS.length` === `kindWordsTestimonials.length`**
- [ ] Caveat loaded in **`index.html`**; **`Heart`** + **`useReducedMotion`** imported in **`Home.tsx`**
- [ ] Section **h2** uses **`text-2xl font-bold text-white md:text-3xl`** only
