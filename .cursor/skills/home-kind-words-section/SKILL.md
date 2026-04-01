---
name: home-kind-words-section
description: >-
  Restores the Home page “Kind words” testimonials baseline: ink-style cards
  (not glass case-study-card), scrolling peer-feedback hearts background, subtle
  grid drift, section layout and a11y. Use when reverting experiments on Kind
  words or matching this treatment elsewhere.
---

# Home — Kind words section (saved baseline)

## When to use

- User wants to **revert** Kind words to the **current shipped look** after trying other card styles (e.g. border glow, different glass).
- User asks to **recreate** the same **hearts + ink cards** pattern on another page.
- Agent is editing `Home.tsx` Kind words and should **preserve** these contracts unless the user asks to change them.

## Files

| Area | File |
|------|------|
| Section markup, data map, hearts | `src/pages/Home.tsx` |
| Card surface, hearts track, cards drift, reduced motion | `src/styles.css` |
| Per-heart float animation | `src/styles.css` — `.peer-feedback-heart` + `@keyframes peer-feedback-heart-drift` (shared with case study peer feedback) |

## Imports (`Home.tsx`)

- `Quote` and `Heart` from `lucide-react`.
- `motion` from `motion/react` for section heading and each testimonial `motion.article`.

## Data and helpers (baseline)

- **`kindWordsTestimonials`**: array of `{ paragraphs: string[], attribution: string }` (copy changes over time; structure stays).
- **`KIND_WORDS_HEARTS`**: same 10 entries as case study **`PEER_FEEDBACK_HEARTS`** in `CaseStudyPredefinedRoles.tsx` (positions, sizes, delays, durations, rgba colors).
- **`KindWordsHeartHalf`**: renders one vertical half of the tiled field; each `Heart` uses **`className="peer-feedback-heart"`** plus inline `style` for position/size/color and animation delay/duration.

## Section structure (baseline)

1. **`<section id="kind-words">`**
   - `className`: `relative isolate z-10 w-full shrink-0 overflow-hidden px-6 py-16 md:px-12 md:py-20 lg:px-16`
   - `aria-labelledby="kind-words-heading"`
   - **No** top border stroke on the section.

2. **Hearts layer** (behind content)
   - Wrapper: `absolute inset-0 z-0 overflow-hidden` + vertical **mask** (transparent → black 6%–94% → transparent) for soft top/bottom fade.
   - Inner: **`kind-words-hearts-track`** with `style={{ height: "200%" }}`, containing **two** `<KindWordsHeartHalf />` (`layerKey="a"` and `"b"`) for a seamless **85s** vertical scroll loop.

3. **Content column** — `relative z-10 mx-auto max-w-[1200px]`
   - Heading block: `motion.div` + **`<h2 id="kind-words-heading">`** “Kind words” (`text-2xl font-bold text-white md:text-3xl`). **No** subtitle paragraph under the title (baseline).
   - Grid: **`kind-words-cards-drift`** + `grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8`.

4. **Each testimonial** — **`motion.article`**
   - `className`: **`kind-words-card relative overflow-hidden rounded-2xl p-6 md:p-8`**
   - `Quote` icon, `blockquote` with spaced paragraphs, `footer` with `border-t border-slate-600/40` and attribution.
   - **Not** wrapped in a border-glow shell; **not** `case-study-card`.

## CSS to preserve (`src/styles.css`)

Restore this block if it was removed or overwritten (comments optional but helpful):

```css
/* Kind words testimonial cards: opaque ink panels + soft radial blooms (no glass blur). */
.kind-words-card {
  background:
    radial-gradient(ellipse 130% 88% at 92% -8%, rgba(124, 58, 237, 0.24) 0%, transparent 44%),
    radial-gradient(ellipse 105% 78% at 6% 102%, rgba(0, 174, 239, 0.15) 0%, transparent 48%),
    linear-gradient(
      168deg,
      rgba(15, 23, 42, 0.97) 0%,
      rgba(2, 6, 23, 0.99) 48%,
      rgba(15, 23, 42, 0.96) 100%
    );
  border: 1px solid rgba(71, 85, 105, 0.38);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.055),
    0 20px 50px -32px rgba(0, 0, 0, 0.72);
  transition: border-color 0.28s ease, box-shadow 0.28s ease;
}

.kind-words-card:hover {
  border-color: rgba(100, 116, 139, 0.48);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 56px -30px rgba(0, 0, 0, 0.78),
    0 0 0 1px rgba(0, 174, 239, 0.14);
}

/* Home Kind words: seamless slow scroll of peer-feedback-style hearts behind cards */
@keyframes kind-words-hearts-scroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -50%, 0);
  }
}

.kind-words-hearts-track {
  animation: kind-words-hearts-scroll 85s linear infinite;
  will-change: transform;
}

@keyframes kind-words-cards-drift {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -20px, 0);
  }
}

.kind-words-cards-drift {
  animation: kind-words-cards-drift 52s ease-in-out infinite alternate;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .kind-words-hearts-track {
    animation: none;
    transform: translate3d(0, -15%, 0);
  }

  .kind-words-cards-drift {
    animation: none;
    transform: none;
  }
}
```

## Intentionally **not** in baseline

- **React Bits / conic rotating border glow** (`.kind-words-glow-shell`, `.kind-words-glow-rotate`) — reverted; do not re-add unless the user asks.
- **`case-study-card`** on Kind words cards — baseline is **ink panels**, distinct from listing/detail glass.

## Quick restore checklist

1. `Home.tsx`: section id, hearts mask + track + two halves, heading only (no subtitle), `kind-words-cards-drift` grid, `motion.article` + `kind-words-card` classes as above.
2. `styles.css`: full block above + existing `.peer-feedback-heart` rules unchanged.
3. Confirm **`prefers-reduced-motion`** still disables hearts track + cards drift animations.
