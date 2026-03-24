---
name: aurora-alt-background
description: Reuses the warm Aurora section background pattern for myportfolio. Use when the user asks for an alternate full-width section background, aurora background, or this specific E0CAA2 + teal/purple/green treatment.
---

# Aurora Alt Background

Use this when applying the same alternate background treatment used in the `Experience & communication` section.

## Pattern

Use a section-level base color plus a full-bleed Aurora layer.

### Section container

- Base color: `bg-[#E0CAA2]`
- Keep section `relative` so Aurora can be absolutely positioned.
- Keep content in a higher layer (`relative z-[1]`) so text/images stay readable.

### Aurora colors

- `color1="#afe2e4"`
- `color2="#725dc6"`
- `color3="#23d180"`

## Reference implementation

`src/pages/CaseStudyPredefinedRoles.tsx`:

```tsx
<motion.section className="relative ... bg-[#E0CAA2] ...">
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <Aurora
      className="inset-0"
      color1="#afe2e4"
      color2="#725dc6"
      color3="#23d180"
    />
  </div>
  <div className="mx-auto w-full max-w-[1200px]">
    <div className="relative z-[1] p-6 md:p-8">
      {/* section content */}
    </div>
  </div>
</motion.section>
```

## Reuse guidance

- Prefer this exact combo when user says:
  - "use the same alt background"
  - "reuse the Aurora background"
  - "same warm background treatment"
- If text contrast drops, keep Aurora and adjust only base color or text color.
