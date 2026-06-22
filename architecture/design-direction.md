# ISF Design Direction

## Status

Approved on 2026-06-21.

## Design Idea

Present ISF as a credible, contemporary Islamic service organization: hopeful enough to invite participation, disciplined enough to earn donor trust, and clear enough to make the work tangible without conventional still imagery of living beings.

Use the supplied nonprofit references as compositional and tonal influences, not as templates to reproduce. Combine the first reference's restraint and whitespace with the second reference's campaign energy and deeper content pathways.

## Visual Character

- Spacious white canvas with soft neutral section surfaces
- Logo green as the primary brand color
- Brighter yellow-green reserved for key actions, small indicators, and high-value highlights
- Black and near-black typography for authority and contrast
- Deep forest panels for campaign, volunteer, video, and footer moments
- Faceless illustration and non-animate imagery on restrained green fields
- Modular cards for programs, impact, process, stories, and frequently asked questions
- Campaign progress, event, resource, news, volunteer, and video modules where supported by real CMS content
- Large concise headings, disciplined body copy, and clear hierarchy
- Subtle geometric motifs informed by the logo and Islamic visual culture
- Layered geometric, brush-like, or calligraphic edge treatments may add energy without imitating the second reference's exact artwork
- Minimal animation used to clarify state and progression, never to distract

## Homepage City Narrative

Use an original layered city illustration as the homepage's visual spine. The composition should feel rooted in Nigerian urban life while incorporating mosque architecture and abstract service landmarks. Do not copy the supplied reference's skyline, palette, or composition.

Suggested layers, back to front:

1. Atmospheric gradient and subtle geometric texture
2. Distant terrain or low city mass
3. Nigerian urban skyline and mosque architecture
4. Foreground service landmarks and section transitions

Map content chapters intentionally onto the environment:

- Hero: ISF mission and primary actions
- Da'wah: mosque, learning, or broadcast architecture
- Welfare and Zakat: distribution and community-service setting without people
- Humanitarian aid: logistics, supplies, clinic, water, or shelter symbols
- Impact: verified metrics integrated as restrained wayfinding markers
- Final call to action: the city resolves into a calm, hopeful horizon

Use small scroll-linked transform ranges rather than dramatic depth. Keep content panels stable and highly legible. On mobile, reduce or flatten the layers. Under `prefers-reduced-motion: reduce`, render the composed city statically and remove scroll-linked transforms.

Decorative layers must be ignored by assistive technology, must not capture pointer input, and must not delay meaningful content or the largest contentful paint. Do not use scroll hijacking, continuous background animation, or a video background for this effect.

No people, birds, animals, or other animate silhouettes may appear in the city artwork.

## Shape Language

Use a controlled radius scale:

```text
compact controls: 10-12px
standard cards:    16-20px
feature cards:     24px
hero/footer frame: 28-36px
pill actions:      999px
```

Treat these as design tokens, not isolated guesses. Reduce radii slightly on compact mobile layouts where needed. Do not round every container: plain text sections, tables, lists, and structural dividers may remain square or use minimal rounding so feature surfaces retain emphasis.

Use borders, soft neutral fills, or restrained shadows to separate surfaces. Avoid heavy glassmorphism, inflated shadows, and excessive nested rounded boxes.

## Layout Grammar

- Use a centered wide content container with consistent responsive gutters.
- Give major chapters generous vertical space and strong headline-to-body hierarchy.
- Use one strong composition per section rather than many competing widgets.
- Alternate balanced grids with asymmetric editorial splits, commonly near `5:7` or `7:5`.
- Use three-column service/program grids on wide screens, two columns on tablets, and one column on small screens.
- Use full-width tinted panels for verified impact moments and major calls to action.
- Keep campaign progress close to its label, source context, dates, and action.
- Present FAQ content as quiet full-width rows or a contained dark panel, with accessible disclosure controls.
- End with a substantial deep-forest footer framed by the largest radius tier.

Oversized numerals may create memorable impact moments only when the value, unit, period, and source are verified in the CMS. Do not use decorative fake counts.

## Layout References

Learn from the two later references:

- Large rounded hero canvas
- Strong headline scale and purposeful typography
- Compact benefit cards
- Campaign progress visualization
- Oversized verified statistics
- Alternating split layouts
- Dark FAQ and footer anchors
- Pill-shaped primary actions

Do not carry over their human photography, hand photography, exact green palette, copy, or campaign claims.

## Editorial Tone

- Hopeful, direct, compassionate, and grounded
- Faith-conscious without being performative
- Confident about the mission and careful about factual claims
- Donor-facing language should explain the need, intended use, and expected result without pressure or guilt
- Program language should center service, dignity, stewardship, and community agency
- Calls to action should use plain verbs such as `Support`, `Explore Programs`, `Get Involved`, and `Contact ISF`

## Media Rules

- Do not use conventional still photographs or realistic still depictions of humans, animals, or other animate beings.
- Use faceless illustrations, architecture, landscapes, objects, aid materials, books, calligraphy, geometric motifs, maps, charts, and typographic compositions.
- Video is permitted. Require documented permission, safeguarding, modest presentation, and dignified framing for identifiable people.
- Do not extract a human portrait from video for use as a conventional promotional still or thumbnail; use a compliant illustration, object/environment frame, or designed title card.
- Avoid degrading, intrusive, graphic, or pity-driven visual storytelling in every medium.
- Require meaningful alt text, media type, approval state, optional caption, and attribution in the CMS.

## Trust and Impact

- Publish statistics only when a source, period, and owner are recorded.
- Distinguish goals, ongoing work, and verified outcomes.
- Do not manufacture testimonials, beneficiary stories, campaign urgency, or national reach.
- Pair fundraising prompts with clear program context and transparent status.

## Accessibility

- Meet WCAG AA contrast for text and controls; bright green may require dark text.
- Preserve keyboard navigation, visible focus, semantic headings, descriptive links, and reduced-motion behavior.
- Never encode status or meaning by color alone.

## Reference Translation

Adopt from the reference:

- Clear, mission-led hero storytelling
- Program and impact cards
- Mission and vision blocks
- Clear process explanation
- Testimonials or stories when verified
- FAQ structure
- Repeated but restrained calls to action
- Campaign progress and donation context
- Volunteer and participation pathways
- Video features and news modules

Adapt for ISF:

- Broader program taxonomy
- Islamic values and language
- Stronger transparency and content provenance
- Dignified beneficiary representation
- No conventional still imagery of living beings
- Faceless illustration and compliant video storytelling
- Logo-led green palette
- Donation placeholder until payment integration is approved

Avoid copying the reference's exact layout, artwork, typography, copy, or distinctive decorative composition.
