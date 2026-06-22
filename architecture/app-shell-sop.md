# App Shell SOP

## Goal

Provide the first deployable ISF website shell: public routes, admin CMS entry point, Supabase browser-client wiring, Vercel SPA routing, and approved visual direction foundations.

## Scope

This shell is intentionally content-safe. It may show approved program categories, stakeholder-designated social links, and explicit placeholders. It must not invent:

- donation account details or transaction flows
- campaign totals, urgency, or raised amounts
- testimonials, beneficiary stories, or impact statistics
- active event schedules or geographic coverage

## Route Surface

Public routes:

- `/`
- `/about`
- `/programs`
- `/campaigns`
- `/activities`
- `/resources`
- `/impact`
- `/get-involved`
- `/donate`
- `/contact`

Admin route:

- `/admin`

The admin route is currently a CMS shell. Before real content operations are added, it must be protected by Supabase Auth, explicit active staff profiles, role checks, RLS policies, and audit behavior.

## Visual Rules

- Use the approved ISF green, lime accent, soft neutrals, deep forest panels, and radius hierarchy.
- Use a CSS-built city/parallax scene made of architecture and abstract shapes only.
- Do not add people, animals, birds, or other animate silhouettes to still media or decorative layers.
- Respect `prefers-reduced-motion` by freezing decorative motion.

## Environment

Browser-safe values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL` when known

Private values remain in `.env.local` only and must never be committed.

## Verification

Run before committing app-shell changes:

```bash
npm run lint
npm run build
```

Both commands must pass before pushing a deploy-intended checkpoint.
