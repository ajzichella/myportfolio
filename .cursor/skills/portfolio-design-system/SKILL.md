---
name: portfolio-design-system
description: Enforces primary CTA button pattern, link color (#00aeef), and transparent-PNG-safe image styling for the myportfolio project. Use when adding buttons, CTAs, links, or images, or when the user asks about design consistency.
---

# Portfolio Design System

## Git & Attribution

**Never include "Made with Cursor" or similar attribution** in any files or commit messages. Remove it if present. The project uses a commit-msg hook to strip `Made-with: Cursor` from commits.

## Primary CTA Button

Use the `rainbow-cta` class for primary call-to-action buttons. Do not use scale/zoom on hover.

### Structure

```tsx
<a
  href="..."
  target="_blank"
  rel="noreferrer noopener"
  className="rainbow-cta group relative inline-flex rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
>
  <span className="relative flex w-full min-w-0 items-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white transition-all duration-200 group-hover:opacity-95">
    <span className="flex flex-1 justify-center min-w-0">
      Button text
    </span>
    <span className="flex shrink-0 w-0 overflow-hidden justify-end transition-all duration-200 ease-out group-hover:ml-2 group-hover:w-4">
      <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </span>
  </span>
</a>
```

### Rules

- **No scale on hover** — Do not add `hover:scale-*` or similar zoom effects.
- **Text centered** — Text stays centered via the `flex-1 justify-center` wrapper.
- **Arrow on hover** — Arrow animates in from the right; button width extends to fit. Use `ArrowRight` from `lucide-react`.
- **CSS** — The `.rainbow-cta` class is defined in `src/styles.css` (rainbow gradient border, glow).

### Without optional arrow

For simpler CTAs that don't need the arrow:

```tsx
<a
  href="..."
  className="rainbow-cta group relative inline-flex rounded-[8px] p-[2px] ..."
>
  <span className="relative flex items-center justify-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white ...">
    Button text
  </span>
</a>
```

---

## Links

All links use **#00aeef** for consistency.

- Inline links: `className="text-[#00aeef] hover:underline"`
- Focus ring: `focus-visible:ring-[#00aeef]`
- Global default: `a { color: #00aeef; }` in `src/styles.css` (already applied)

When adding new links, ensure they use `#00aeef` unless overridden for a specific design reason.

### Non-link accent text

For labels, bullets, badges, metrics, and other **non-link** emphasis on dark UI, use the utility class **`text-accent-readable`** (`#a3e8f7` in `src/styles.css`) instead of `text-[#00aeef]` so copy stays legible while still reading as cyan. **Links, `NavLink` items, and Lucide / decorative icons stay `#00aeef` (or `#00aeef`/opacity where used before).**

### Bullet marker color

Use the **main blue** for list markers in case-study body content:

- Prefer `marker:text-[#00aeef]` on the parent `<ul>` so all child bullets inherit consistently.

---

## Transparent PNG Images

Images in this project may have transparent backgrounds. Follow these rules to prevent Chromium from compositing them against a black matte.

### Forbidden wrapper styles

Never apply any of these CSS properties to a container that wraps a transparent PNG:

- `overflow-hidden` — clips compositing to the box, which fills transparent regions with black.
- `isolate` / `isolation: isolate` — creates a stacking context that forces black-matte compositing on alpha channels.
- `backdrop-filter` / `backdrop-blur-*` — same compositing issue; the blur layer treats transparent pixels as opaque black.

**Same card, two columns:** In rare cases Chromium can composite transparent PNGs in the image column as black when the **sibling** text column uses `backdrop-blur-*`. Prefer keeping one consistent frosted text treatment across all cards (`backdrop-blur-xl`). Only as a **last resort** for a specific card, swap that row to **`bg-slate-950/75`** + a light ring instead of `backdrop-blur` — and only if the user accepts the visual difference.

These are safe on **opaque** images only (e.g. solid-background screenshots where no alpha channel exists).

### Motion + filters

Avoid wrapping transparent PNGs in **`motion.div`** with `whileHover` transforms when the `<img>` also uses **`filter: drop-shadow`** — combine **transform on the parent** with **filter on the child** can trigger black matting. Prefer **`motion.img`** with hover on the image itself, and omit drop-shadow on that layout if issues persist.

### Safe pattern

Put visual styling directly on the `<img>` element, not on a wrapper `<div>`:

```tsx
<div className="min-w-0">
  <img
    src={imageSrc}
    alt="..."
    className="w-full rounded-lg drop-shadow-xl"
  />
</div>
```

- **`rounded-lg`** on `<img>` — rounds corners without needing `overflow-hidden` on a parent.
- **`drop-shadow-xl`** on `<img>` — follows the alpha channel (unlike `shadow-*` / `box-shadow` which draws a rectangular shadow around the element box).
- **No `box-shadow` / `shadow-*`** on transparent images — always use `drop-shadow-*` instead.
- **No opaque `bg-*`** on wrappers — do not add background colors behind transparent images.

### Copying images into `public/`

When the user provides image files, **always copy directly from the source path they specify** (e.g. `C:\Users\AJ\Desktop\file.png`), never from Cursor's workspace-storage asset cache (`C:\Users\AJ\.cursor\projects\...\assets\...`). The cached copies may be older, lower-quality, or non-transparent versions. After copying, verify the file size matches the source.

### Existing component

`CaseStudyCard.tsx`: **single-hero** images may use `drop-shadow-xl` on `<img>`. **Any overlapping / stacked pair** (RBAC, Kafka, hero-phone) uses **`motion.img`** with hover transforms on the image itself and **no** `drop-shadow` on those layers, so compositing stays clean.
