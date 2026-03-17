---
name: portfolio-design-system
description: Enforces primary CTA button pattern and link color (#00aeef) for the myportfolio project. Use when adding buttons, CTAs, or links, or when the user asks about design consistency.
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
