# Progress

## 2026-06-21

- Initialized B.L.A.S.T. project memory.
- Added repository instructions that invoke the personal `$blast-system-pilot` skill.
- Normalized the constitution filename to `PROJECT_CONSTITUTION.md`.
- Left implementation pending Blueprint discovery and schema approval.
- Recorded the user-provided North Star for audience growth and prospective-donor conversion.
- Recorded the stakeholder-provided organization profile and clearly marked unverified claims.
- Attempted external verification; the search service returned HTTP 403, so official source links are still required.
- Recorded stakeholder-designated Instagram and Facebook URLs; direct platform verification remained blocked by HTTP 403.
- Added a sanitized copy of the supplied SVG logo at `public/assets/isf-logo.svg` and verified that it contains no active or external content.
- Could not render a local logo preview because the available image and Quick Look paths were blocked in the current sandbox.
- Recorded the decision to use a non-functional donation placeholder until payment integration details are supplied.
- Recorded three approved program categories while separating them from unverified activity and impact claims.
- Confirmed that the project will include an authenticated admin dashboard/CMS backed by the canonical content database.
- Inspected the local Baytul Asmaa application read-only and documented its React/Vite, Supabase, custom-admin, and Vercel pattern.
- Adopted that delivery approach for ISF with broader content domains and stronger role-based authorization requirements.
- Confirmed that ISF will use new, isolated Supabase and Vercel projects under the user's existing accounts.
- Analyzed the supplied visual reference and documented a proposed ISF-specific tone and design direction.
- Integrated a second campaign-led reference and replaced the earlier photography direction with ISF's confirmed no-living-still-images rule.
- Recorded user approval of the directional Blueprint and behavioral/design standard.
- Added the user's layered city parallax direction with accessibility, performance, Islamic media, and responsive guardrails.
- Derived and documented a radius hierarchy and editorial layout system from two additional references.
- Received approval for CMS data contract `0.1.0`, completed Blueprint, and entered the Link phase.
- Checked local Supabase and Vercel tooling and credentials; neither service has an authenticated local session.
- Attempted temporary CLI downloads and the Vercel connector; both stalled before authentication, so no external project was created or modified.
- Recorded Supabase project ref `vcngwmghpjpchcnpamyx`, configured its public URL locally, and confirmed the host responds while requiring authentication.
- Added and ran `tools/check-supabase-link.mjs`; verified the project and Supabase Auth, REST, Storage, and Realtime services are healthy without exposing credentials.
- Diagnosed a Vercel GitHub import error: the local ISF repository has no commits and no GitHub remote, so Vercel cannot find a branch or commit to deploy yet.
- Connected the local ISF repository to `https://github.com/Aleemcode/Islamaffaircarefoundation.git` and prepared the initial `main` branch commit.
- Created commit `02e7564` (`Initialize ISF project blueprint`) and pushed `main` to GitHub for Vercel import.
- User reported the Vercel/GitHub import step was completed. Local verification still needs either a Vercel token or the resulting Vercel project/deployment URL.
- Checked local deployment readiness after import: Supabase frontend values are present in `.env.local`, Vercel token is not present, and the repository does not yet include the React/Vite application scaffold.
- Added and ran `tools/check-vercel-link.mjs`; verified the saved Vercel token with HTTP `200` and confirmed no team ID is required for the current personal-account setup.
- Rechecked `.env.local`: all required Supabase and Vercel values are present, optional team/site fields may remain blank, Supabase URL matches the project ref, and `.env.local` remains ignored by Git.
- Reran live Supabase and Vercel Link checks; both returned HTTP `200` for their required handshakes, with Supabase services reporting `ACTIVE_HEALTHY`.

## 2026-06-23

- Started the Architect phase after Link verification.
- Added the first deployable React/Vite application shell with public routes, donation placeholder, contact/social route, admin CMS shell, Vercel SPA rewrite, Supabase browser-client wiring, ISF design tokens, and a CSS-based city parallax scene.
- Added `architecture/app-shell-sop.md` to document app-shell scope, route surface, media restrictions, environment requirements, and verification commands.
- Installed npm dependencies; audit reported `0` vulnerabilities.
- Ran `npm run lint` and `npm run build`; both passed after aligning TypeScript path aliases with Vite.

## 2026-06-30

- Resumed the inactive/paused remote Supabase project `vcngwmghpjpchcnpamyx` using user instructions.
- Synced the remote Postgres database password with the local `.env.local` credentials via the Supabase Management API.
- Linked the local CLI and successfully pushed all core schema migrations and bootstrap settings (`20260623090000_cms_core.sql` and `20260623091000_seed_site_settings.sql`) to the remote Supabase database.
- Fixed a bug in `tools/check-database-link.mjs` to correctly verify Row Level Security (RLS) policies for tables returning HTTP 200 with empty arrays `[]`.
- Ran database connection check script (`node tools/check-database-link.mjs`) and confirmed all tables and storage bucket structures are healthy and secured.
- Discussed database pricing options and set up a daily GitHub Actions keep-alive workflow (`.github/workflows/keep-alive.yml`) to prevent automatic Supabase pausing.
- Implemented CMS Admin Authentication & Role-Based Access Control (RBAC):
  - Created `AuthProvider` context and `useAuth` hook wrapper.
  - Implemented the `AdminLogin` form UI using Nigeria forest green styling parameters.
  - Updated `AdminShell` to redirect unauthenticated staff and block unactivated profiles.
  - Wrapped core routes in `App.tsx` and validated compilation with `npm run lint` and `npm run build`.
- Implemented CMS CRUD Modules & Public Website Integrations:
  - Created settings manager, file uploader (media library), programs manager, campaigns manager, events manager, stories manager, and resources manager.
  - Refactored `AdminShell` to include tab navigation for CMS modules.
  - Wired public website pages (`Home`, `Donate`, `Contact`, `Programs`, `Campaigns`, `Activities`, `Resources`, and `Impact`) to pull live content and handle public inquiry submissions.
  - Appended layout, table, modal, and uploader CSS to `styles.css` and verified compilation with `npm run lint` and `npm run build`.
  - Removed the white background from the logo SVG (public/assets/isf-logo.svg) to make it transparent.
  - Created an emblem-only SVG (public/assets/isf-emblem.svg) by cropping the original SVG's viewBox to focus on the central dome.
  - Updated the navbar and footer brand lockups in src/components/Layout.tsx to use the new emblem-only SVG and display the full name "Islamaffair Care Foundation" horizontally in crisp HTML/CSS.
  - Increased the size of the logo in src/styles.css from 34px to 48px, improved spacing, styled the new brand text, and added responsive layout adjustments for smaller screens.
  - Updated src/pages/admin/AdminShell.tsx to render the clean isf-emblem.svg in the console brand sidebar.
  - Synchronized the organization name metadata in src/data/siteContent.ts to use "Islamaffair Care Foundation".
- Completed Stylize Phase Landing Page Iteration:
  - Installed `frontend-design`, `ui-ux-pro-max`, and `copywriting` skills under `.agents/skills/`.
  - Refactored `src/pages/Home.tsx` to add an Islamic Utility Info Bar displaying dates and Lagos prayer times.
  - Implemented a Quick Donation Status Widget and live campaigns section with visual progress trackers.
  - Created a Scholarly Board Assurance Card explaining our strict verification system.
  - Refactored typography by importing and pairing "Outfit" and "Playfair Display" Google Fonts.
  - Fixed CSS compile warnings related to import statements ordering and verified build compiles successfully.
  - Integrated official brand primary green and pure white SVG logos into the top navigation header, footer brand section, and admin console sidebar.
  - Resolved public page loading blocks by refactoring database calls across all public pages (Home, Programs, Campaigns, Activities, Resources, Impact) to render static fallback data instantly on load and fetch live data asynchronously in the background.
