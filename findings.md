# Findings

## Repository State

- Repository is newly initialized and contains no application code.
- The B.L.A.S.T. standard is the requested delivery framework.
- `PROJECT_CONSTITUTION.md` is the canonical constitution filename for this project.

## Open Questions

- Integrations, source data, delivery payload, and behavioral rules are not yet defined.
- Conversion metrics and target values are not yet defined.

## Confirmed Discovery

- North Star: attract an audience and convert prospective donors into support for da'wah initiatives.

## Stakeholder-Provided Organization Profile

- Primary name: Islamaffairs Foundation.
- Alternate names supplied: Islamaffair Care Foundation and Islamaffair Foundation.
- Organization type: faith-based NGO operating in Nigeria.
- Stated focus: Islamic propagation, community outreach, charitable welfare, and religious education.
- Potential program areas supplied for validation:
  - Zakat and Sadaqa collection and distribution to orphans, low-income people, and vulnerable families.
  - Islamic da'wah through lectures, seminars, and educational resources.
  - Humanitarian support including food, clothing, medical supplies, Ramadan programs, and community-response aid.
- Stakeholder-designated public channels:
  - Instagram: https://www.instagram.com/islamaffaircarefoundation/
  - Facebook: https://web.facebook.com/Islamaffair.f/

## Verification Status

- The organization profile above is stakeholder-provided and has not yet been independently verified.
- The program list may describe common sector activity rather than this foundation's confirmed current programs.
- Legal registration details, contact information, program evidence, and impact figures remain pending.
- External web search was attempted on 2026-06-21 but the search endpoint returned HTTP 403.
- Direct verification of the supplied Instagram and Facebook pages was also blocked by HTTP 403. The URLs are therefore recorded as stakeholder-designated official channels, not independently authenticated accounts.

## Brand Assets

- The supplied primary logo is stored at `public/assets/isf-logo.svg`.
- The sanitized SVG has a square `774 x 774` view box and uses green (`#669934`), light green (`#b3cc9a`), and white (`#ffffff`).
- Script, event-handler, external resource, foreign-object, entity, and doctype checks passed after removing the source file's unnecessary external DTD declaration.
- Visual rendering remains pending because both available local preview methods failed in the current sandbox.

## Integration Decisions

- Link to the stakeholder-designated Instagram and Facebook channels.
- Use a clearly labeled, non-functional donation placeholder until the user supplies the payment method and account details.
- Do not select a payment provider, invent bank details, or imply that a donation was processed.
- Create new Supabase and Vercel projects dedicated to ISF under the user's existing accounts.
- Do not reuse Baytul Asmaa databases, authentication users, storage buckets, environment values, analytics data, or deployments.
- Supabase and Vercel project creation and credential verification belong to the Link phase.

## Link Evidence

- Node.js `20.20.1` and npm `10.8.2` are available locally.
- Supabase and Vercel CLIs are not installed.
- Temporary CLI downloads could not complete through the available network path.
- The Vercel connector did not return an authenticated team response.
- No `SUPABASE_*` or `VERCEL_*` environment variables, local access tokens, or reusable CLI sessions were found.
- Dedicated cloud projects cannot be created or verified until the user authorizes the corresponding accounts.
- The user created or selected Supabase project `vcngwmghpjpchcnpamyx` at `https://vcngwmghpjpchcnpamyx.supabase.co`.
- The project host responded to a public Auth health request with HTTP `401`, confirming network reachability while correctly requiring an API key.
- On 2026-06-22 the authenticated Management API reported project status `ACTIVE_HEALTHY` in region `eu-central-1`.
- Supabase Auth, REST, Storage, and Realtime each reported `ACTIVE_HEALTHY`; the Auth client handshake returned HTTP `200` using the publishable key.
- The REST schema-catalog root returned HTTP `401` because it requires a secret key. This is expected and no browser-unsafe secret key will be introduced; table-level public access will be tested after migrations and RLS are applied.

## Content Source of Truth

- Build a secure admin dashboard as part of the project; it must also serve as the website CMS.
- The CMS backing database becomes the canonical source for published programs, campaigns, impact content, media references, and contact details.
- Stakeholder-supplied content is the bootstrap source until it is entered into the CMS.
- Social media is a distribution channel, not the canonical content store.

## Vercel Git Import Finding

- On 2026-06-22, Vercel showed: "The provided GitHub repository does not contain the requested branch or commit reference. Please ensure the repository is not empty."
- Local evidence: the ISF repository has no commits yet, is still on local branch `master`, and has no GitHub remote configured.
- Vercel Git imports require a repository branch with at least one pushed commit before the project can be imported and deployed.
- Before using Vercel's GitHub import flow, create or connect a GitHub repository, make an initial commit, push a production branch such as `main`, and then import that repository in Vercel.
- The selected GitHub repository is `https://github.com/Aleemcode/Islamaffaircarefoundation.git`.

## Baytul Asmaa Reference Architecture

- Reference repository inspected read-only: `/Users/aleemakinyoola/Documents/baytulasmaa`.
- Public application: React, TypeScript, Vite, React Router, Tailwind CSS, and Vercel Analytics.
- Backend services: Supabase Auth, Postgres-backed content queries, and Supabase Storage.
- Administration: protected `/admin` routes, email/password authentication, dashboard statistics, search, create/edit, draft/published state, archive/restore, and media upload.
- Deployment: Vercel SPA rewrite configuration.
- ISF will reuse this architectural approach, not copy Baytul Asmaa's organization-specific content model or visual identity.
- Security improvement required: ISF authorization must verify explicit staff roles and enforce them through Supabase Row Level Security; a client-side authenticated-user guard alone is insufficient.
- Reliability improvement required: CMS content is canonical, so public pages must expose a clear degraded state rather than silently replace unavailable live content with stale embedded claims.

## Proposed ISF Scope Expansion

- Public site: home, about, programs/services, campaigns and appeals, activities/events, da'wah resources, impact stories/updates, get involved, donation placeholder, and contact/social links.
- CMS: overview dashboard, pages, programs, campaigns, activities/events, resources, stories/updates, media library, contact/site settings, SEO fields, publication workflow, and staff access.
- Cross-cutting needs: responsive design, accessibility, search-friendly metadata, draft/published/archived states, role-based access, and auditable content changes.
- Donation records and payment processing remain outside the initial data model until a provider and workflow are approved.

## Proposed Visual and Editorial Direction

- First reference supplied on 2026-06-21: a modern nonprofit landing page with a white canvas, vivid green accents, modular cards, impact statistics, spacious sections, and repeated calls to action.
- Second reference supplied on 2026-06-21: a more campaign-led nonprofit page with bold hero messaging, service cards, layered section art, fundraising progress, volunteer prompts, video storytelling, testimonials, news, and a high-contrast footer.
- Desired character: contemporary, hopeful, credible, warm, purposeful, and human-centered.
- Adapt the reference rather than copy it. Anchor the palette in ISF's logo green (`#669934`) and use brighter yellow-green selectively for highlights and calls to action.
- Use black, white, soft neutral surfaces, restrained green tints, and a deep forest tone for high-contrast sections. Any warm secondary accent must remain subordinate to the ISF palette.
- Use strong, concise headings; short explanatory copy; structured impact evidence; and clear action labels.
- Do not use conventional still photographs or realistic still depictions of humans, animals, or other animate beings.
- Permitted visual storytelling includes faceless illustration, non-animate objects and environments, Islamic geometric or calligraphic motifs, typography, diagrams, maps, data visualization, and video.
- Video is permitted, but safeguarding, consent, modesty, accuracy, and non-exploitative framing still apply.
- Avoid pity-led storytelling, graphic hardship, staged vulnerability, unverified statistics, exaggerated urgency, decorative Islamic cliches, and visual clutter.
- Islamic character should come through trustworthy language, service, values, and subtle geometric detail rather than excessive ornament.
- This direction was approved by the user on 2026-06-21.

## Confirmed Media Rule

- ISF does not use normal still images of living or animate beings because of its Islamic ruling on pictures.
- Faceless illustrations and video are permitted.
- The CMS must make permitted media types clear and prevent accidental use of conventional human or animal still photography in public content.

## Parallax City Direction

- Use a layered, illustrated city environment as a narrative spine for the homepage.
- Ground the environment in Nigerian urban character with mosque architecture and service-related landmarks rather than a generic imported skyline.
- Connect homepage chapters to ISF's work: da'wah, welfare, education, campaigns, and humanitarian response.
- Use shallow scroll-linked movement across distant atmosphere, skyline, architectural foreground, and subtle geometric texture.
- Do not include people, birds, animals, or other animate silhouettes.
- Keep body copy on calm opaque or strongly contrasted surfaces; the city supports the layout rather than sitting directly behind dense text.
- Disable motion under `prefers-reduced-motion`, simplify layers on small screens, and preserve a fully composed static fallback.
- Avoid continuous autoplay motion, heavy video backgrounds, scroll hijacking, and excessive depth that could cause motion sickness or poor performance.

## Layout and Radius Taste

- Two additional references supplied on 2026-06-21 favor broad centered containers, large rounded hero/footer frames, medium-radius cards, pill-shaped actions, oversized numeric moments, and alternating editorial grids.
- Use a deliberate radius hierarchy rather than applying one radius everywhere.
- Favor asymmetric split sections, calm three-column service grids, campaign rows, full-width impact panels, restrained carousels, simple FAQ rows, and a substantial dark footer.
- Keep generous whitespace between major chapters while allowing related cards to sit tightly as a family.
- Translate all photo-led compositions into compliant faceless illustration, architecture, non-animate objects, abstract shapes, video title cards, or data-led panels.
- Do not reproduce unverified urgency, fundraising totals, testimonials, campaign progress, or participation counts from the references.

## Approved Program Categories

- **Zakat and Sadaqa Distribution:** charitable support intended for orphans, low-income people, and vulnerable families.
- **Islamic Da'wah:** lectures, seminars, and educational resources for Muslim communities.
- **Humanitarian Aid:** food, clothing, medical supplies, Ramadan support, and responses to community needs.
- These categories are approved for initial website structure, but they do not verify specific active campaigns, geographic coverage, beneficiary counts, or past impact.
