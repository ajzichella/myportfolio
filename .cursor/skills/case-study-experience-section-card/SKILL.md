---
name: case-study-experience-section-card
description: Saved “Experience & communication” band for CaseStudyPredefinedRoles — dark rounded card, cyan–violet gradient wash, slate-900 focus rings. Use when restoring this layout after trying other variants.
---

# Predefined Roles — Experience section (saved card variant)

## When to use

- You changed the **Experience & communication** block on the predefined-roles case study and want to **restore this exact treatment**.
- Ask the agent to **apply the case-study experience card variant** or **follow `.cursor/skills/case-study-experience-section-card/SKILL.md`**.

## Related variants

- For the **minimal** layout (no card, no extra band — page background only), see `.cursor/skills/case-study-experience-section-minimal/SKILL.md`.
- For **full-bleed paw trails + BlurText** (“paw experience”), see `.cursor/skills/case-study-paw-experience/SKILL.md`.

## Location in code

- File: `src/pages/CaseStudyPredefinedRoles.tsx`
- Anchor: `motion.section` with `aria-labelledby="rbac-experience-heading"` (between the strategy/docs column and the video section).

## Design summary

| Layer | Classes / notes |
|--------|------------------|
| Outer section | `relative z-10 mt-16 w-full px-6 md:px-12 lg:px-16` |
| Card shell | `relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-xl border border-slate-600/50 bg-slate-900/35 p-6 shadow-lg shadow-black/25 ring-1 ring-inset ring-white/5 md:p-10` |
| Wash | `absolute inset-0 bg-gradient-to-br from-[#00aeef]/[0.09] via-transparent to-[#5b4ddb]/[0.08]` |
| Top hairline | `absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00aeef]/25 to-transparent` |
| Content wrapper | `relative z-[1]` around all headings, grids, figures |
| H2 | `{sectionTitle}` (white, `md:text-2xl`) |
| H3 | `text-lg font-semibold text-white` |
| Body / figcaption | `text-[#999999]` (`md:text-lg` on body) |
| `LightboxImageButton` | `wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"` |

**Not used in this variant:** `Aurora`, `BlobBackground` on this band, cream `#E8E0C8`, full-bleed `border-y` band.

## Motion

Reuse the page’s `fadeUp` spread and e.g. `transition={{ duration: 0.4, delay: 0.15 }}` on the outer `motion.section`.

## Full reference block (copy as of save)

Replace the current `motion.section` … `rbac-experience-heading` … through its closing `</motion.section>` with the block below if you need an exact restore. **Keep** `base`, `fadeUp`, `sectionTitle`, `setImageLightbox` as in the live file.

```tsx
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.15 }}
          aria-labelledby="rbac-experience-heading"
          className="relative z-10 mt-16 w-full px-6 md:px-12 lg:px-16"
        >
          <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-xl border border-slate-600/50 bg-slate-900/35 p-6 shadow-lg shadow-black/25 ring-1 ring-inset ring-white/5 md:p-10">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00aeef]/[0.09] via-transparent to-[#5b4ddb]/[0.08]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00aeef]/25 to-transparent"
              aria-hidden
            />
            <div className="relative z-[1]">
              <h2
                id="rbac-experience-heading"
                className={sectionTitle}
              >
                Experience &amp; communication
              </h2>

              <section
                aria-labelledby="rbac-invite-role-heading"
                className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)] lg:items-start"
              >
                <div className="min-w-0">
                  <h3
                    id="rbac-invite-role-heading"
                    className="text-lg font-semibold text-white"
                  >
                    Invite team members with a role
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    Uncovered from research, I addressed the need to add the
                    ability to select a role while inviting team members into
                    the DO team. Previously, users needed to invite a team
                    member with a default role and then reassign that role
                    after they have joined. This saves a giant step for users
                    and saves time with role management duties.
                  </p>
                </div>
                <figure className="min-w-0">
                  <LightboxImageButton
                    src={`${base}rbac-invite-members.png`}
                    alt="Invite team members flow with role selection in DigitalOcean"
                    wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    className="w-full rounded-lg"
                    onOpen={setImageLightbox}
                  />
                </figure>
              </section>

              <section
                aria-labelledby="rbac-assign-role-heading"
                className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.78fr)] lg:items-start"
              >
                <figure className="min-w-0">
                  <LightboxImageButton
                    src={`${base}rbac-change-role-modal-full.png`}
                    alt="Change role modal listing predefined DigitalOcean team roles"
                    wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    className="w-full rounded-lg"
                    onOpen={setImageLightbox}
                  />
                </figure>
                <div className="min-w-0">
                  <h3
                    id="rbac-assign-role-heading"
                    className="text-lg font-semibold text-white"
                  >
                    Assign predefined roles
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    Team owners, or users with the correct associated
                    permissions, can update members&apos; roles from team settings
                    through a focused modal that explains scope and impact.
                  </p>
                </div>
              </section>

              <section
                aria-labelledby="rbac-role-comms-heading"
                className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)] lg:items-start"
              >
                <div className="min-w-0">
                  <h3
                    id="rbac-role-comms-heading"
                    className="text-lg font-semibold text-white"
                  >
                    Role communication
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    Communicating role changes is as important as the UI itself.
                    I added email notifications that explain when a role changes
                    and what that role can do, plus an account menu reminder so
                    users can quickly confirm their active role per team.
                  </p>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    It&apos;s also just as vital to celebrate the little moments. I
                    added a banner welcoming new users into their teams and
                    added another line of communication about their role.
                  </p>
                </div>
                <figure className="min-w-0">
                  <LightboxImageButton
                    src={`${base}rbac-role-comms.png`}
                    alt="Email and in-product messaging explaining a user's updated team role"
                    wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    className="w-full rounded-lg"
                    onOpen={setImageLightbox}
                  />
                  <figcaption className="mt-2 max-w-3xl text-sm leading-relaxed text-[#999999]">
                    Clear comms reduce surprise and support tickets during
                    large-scale role migrations.
                  </figcaption>
                </figure>
              </section>
            </div>
          </div>
        </motion.section>
```

If body copy has changed in the repo, restore **shell + typography + image wrappers** from the table above and keep your current paragraph text.
