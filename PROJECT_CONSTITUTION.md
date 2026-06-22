# Project Constitution

## North Star

Attract an audience and convert prospective donors into support for da'wah initiatives.

Measurable conversion targets remain pending Blueprint discovery.

## Data Contracts

Canonical schema version: `0.1.0`

The JSON-compatible contracts below are approved and normative for the initial CMS. Server-managed fields are never accepted from public clients.

### Shared Enums

```json
{
  "content_status": ["draft", "published", "archived"],
  "staff_role": ["owner", "admin", "editor"],
  "media_kind": ["faceless_illustration", "non_animate_image", "video", "document"],
  "media_approval": ["pending", "approved", "rejected"],
  "campaign_status": ["planned", "active", "paused", "completed", "archived"],
  "event_mode": ["physical", "online", "hybrid"],
  "inquiry_type": ["general", "volunteer", "partnership", "media", "support"]
}
```

### Shared Content Record

All public content entities extend this shape:

```json
{
  "id": "uuid",
  "slug": "lowercase-kebab-case",
  "title": "string:1..160",
  "summary": "string:1..320",
  "body": "string:markdown",
  "status": "draft|published|archived",
  "featured_media_id": "uuid|null",
  "seo_title": "string:0..60|null",
  "seo_description": "string:0..160|null",
  "published_at": "ISO-8601 timestamp|null",
  "created_by": "staff-profile uuid",
  "updated_by": "staff-profile uuid",
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp"
}
```

Required on create: `slug`, `title`, `summary`, `body`, and `status`. Identifiers, authorship, and timestamps are server-managed. `published_at` is required when status becomes `published`. Slugs are unique per entity type.

### Staff Profile

```json
{
  "id": "Supabase auth user uuid",
  "display_name": "string:1..100",
  "role": "owner|admin|editor",
  "active": true,
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp"
}
```

Only an owner may change staff roles or activation. At least one active owner must always remain.

### Media Asset

```json
{
  "id": "uuid",
  "kind": "faceless_illustration|non_animate_image|video|document",
  "approval_status": "pending|approved|rejected",
  "storage_path": "string:unique",
  "file_name": "string",
  "mime_type": "approved MIME type",
  "size_bytes": "integer:1..configured-limit",
  "width": "integer|null",
  "height": "integer|null",
  "duration_seconds": "number|null",
  "alt_text": "string:1..300|null",
  "caption": "string:0..500|null",
  "attribution": "string:0..300|null",
  "uploaded_by": "staff-profile uuid",
  "approved_by": "staff-profile uuid|null",
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp"
}
```

Illustrations and images require `alt_text`, `width`, and `height`. Video requires `duration_seconds` and a compliant designed thumbnail. Only `approved` assets may appear publicly. Conventional still images or realistic still depictions of animate beings are invalid.

### Page

Extends Shared Content Record:

```json
{
  "page_key": "home|about|contact|get-involved|donate",
  "sections": [
    {
      "id": "uuid",
      "type": "hero|parallax_scene|rich_text|stats|cards|cta|faq|video",
      "position": "integer>=0",
      "content": "type-validated JSON object"
    }
  ]
}
```

`page_key` is unique. Section content must validate against the selected section type before save or publish.

### Program

Extends Shared Content Record:

```json
{
  "category": "zakat_sadaqa|dawah|humanitarian_aid|other",
  "objectives": ["string:1..240"],
  "service_regions": ["string:1..100"],
  "eligibility_notes": "string:0..1000|null",
  "contact_label": "string:0..80|null",
  "contact_value": "string:0..200|null",
  "featured": false,
  "sort_order": "integer>=0"
}
```

### Campaign

Extends Shared Content Record:

```json
{
  "program_id": "program uuid|null",
  "campaign_status": "planned|active|paused|completed|archived",
  "goal_amount_minor": "integer>0|null",
  "currency": "ISO-4217 code|null",
  "raised_amount_minor": "integer>=0|null",
  "starts_at": "ISO-8601 timestamp|null",
  "ends_at": "ISO-8601 timestamp|null",
  "funding_note": "string:0..500|null",
  "donation_enabled": false
}
```

Money is stored in minor units. Until payment integration is approved, `donation_enabled` must remain `false`; raised amounts may be entered only from a verified organizational source with audit history.

### Event or Activity

Extends Shared Content Record:

```json
{
  "program_id": "program uuid|null",
  "mode": "physical|online|hybrid",
  "starts_at": "ISO-8601 timestamp",
  "ends_at": "ISO-8601 timestamp|null",
  "timezone": "IANA timezone",
  "venue_name": "string:0..160|null",
  "address": "string:0..500|null",
  "registration_url": "https URL|null",
  "registration_required": false
}
```

Physical and hybrid events require venue information. Online and hybrid registration links must use HTTPS.

### Da'wah Resource

Extends Shared Content Record:

```json
{
  "resource_type": "article|audio|video|document|link",
  "speaker_or_author": "string:0..160|null",
  "external_url": "https URL|null",
  "media_asset_id": "uuid|null",
  "topics": ["string:1..80"],
  "review_status": "pending|approved|rejected",
  "reviewed_by": "staff-profile uuid|null",
  "reviewed_at": "ISO-8601 timestamp|null"
}
```

Published religious resources require `review_status=approved` and reviewer attribution. Exactly one of `external_url` or `media_asset_id` is required for linked or hosted resources.

### Story or Update

Extends Shared Content Record:

```json
{
  "story_type": "impact|news|announcement|field_update",
  "program_id": "program uuid|null",
  "campaign_id": "campaign uuid|null",
  "occurred_on": "date|null",
  "location_label": "string:0..160|null",
  "evidence_note": "string:0..500|null",
  "featured": false
}
```

Impact claims require an `evidence_note` identifying the internal or public source without exposing beneficiary data.

### Impact Metric

```json
{
  "id": "uuid",
  "label": "string:1..100",
  "value": "number>=0",
  "unit": "string:1..40",
  "period_start": "date",
  "period_end": "date",
  "program_id": "program uuid|null",
  "source_note": "string:1..500",
  "status": "draft|published|archived",
  "created_by": "staff-profile uuid",
  "updated_by": "staff-profile uuid",
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp"
}
```

### Site Settings

```json
{
  "organization_name": "Islamaffairs Foundation",
  "short_name": "ISF",
  "primary_email": "valid email|null",
  "primary_phone": "E.164 phone|null",
  "address": "string:0..500|null",
  "instagram_url": "https URL|null",
  "facebook_url": "https URL|null",
  "donation_mode": "placeholder|enabled",
  "donation_message": "string:1..300",
  "updated_by": "staff-profile uuid",
  "updated_at": "ISO-8601 timestamp"
}
```

`donation_mode` must remain `placeholder` until a verified payment integration is approved.

### Public Inquiry

```json
{
  "id": "uuid",
  "type": "general|volunteer|partnership|media|support",
  "name": "string:1..120",
  "email": "valid email",
  "phone": "E.164 phone|null",
  "subject": "string:1..160",
  "message": "string:1..3000",
  "consent": true,
  "status": "new|in_progress|resolved|spam",
  "created_at": "ISO-8601 timestamp",
  "resolved_at": "ISO-8601 timestamp|null"
}
```

Public creation accepts only `type`, `name`, `email`, `phone`, `subject`, `message`, and `consent`. Rate limiting and anti-spam validation are mandatory. Inquiry records are private to authorized staff.

### Audit Event

```json
{
  "id": "uuid",
  "actor_id": "staff-profile uuid",
  "action": "create|update|publish|archive|restore|delete|approve|reject|role_change",
  "entity_type": "string",
  "entity_id": "uuid|string",
  "before": "JSON object|null",
  "after": "JSON object|null",
  "created_at": "ISO-8601 timestamp"
}
```

Audit events are append-only and inaccessible to public clients.

### API Envelopes and Errors

Success responses use:

```json
{
  "data": "object|array|null",
  "meta": {
    "request_id": "uuid",
    "page": "integer|null",
    "page_size": "integer|null",
    "total": "integer|null"
  }
}
```

Errors use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR|UNAUTHENTICATED|FORBIDDEN|NOT_FOUND|CONFLICT|RATE_LIMITED|INTERNAL_ERROR",
    "message": "safe human-readable message",
    "field_errors": { "field": ["message"] },
    "request_id": "uuid"
  }
}
```

Never expose stack traces, secrets, storage internals, RLS details, or beneficiary data in public errors.

## Behavioral Rules

- Do not guess business logic.
- Do not expose or commit secrets.
- Verify claims about integrations, tests, deployment, and payload delivery with evidence.
- Keep changes reversible until the Blueprint is approved.
- Keep the initial donation control non-functional and clearly marked as unavailable until a payment provider is approved and verified.
- Never invent payment credentials, bank details, transaction states, or donation confirmations.
- Present Zakat and Sadaqa, Islamic da'wah, and humanitarian aid as program focus areas without inventing active campaigns, nationwide reach, beneficiary counts, impact figures, or completed work.
- Do not publish conventional still photographs or realistic still depictions of humans, animals, or other animate beings.
- Permit faceless illustrations and video, subject to dignity, consent, safeguarding, modesty, accuracy, and non-exploitative storytelling.
- Permit a layered architectural city parallax without animate silhouettes. It must respect reduced-motion preferences, retain a static fallback, and never compromise content contrast or navigation.

## Architectural Invariants

- Maintain documented architecture, orchestration, and deterministic execution responsibilities.
- Update the relevant SOP before or with changes to business logic.
- Keep temporary artifacts out of production payloads and version control.
- Provide an authenticated admin dashboard that doubles as the website CMS.
- Treat the CMS database as the canonical source for published website content; do not use social media as the system of record.
- Follow the Baytul Asmaa delivery pattern: React/TypeScript/Vite frontend, custom routed admin experience, Supabase backend services, and Vercel deployment/analytics.
- Enforce staff authorization in Supabase Row Level Security and role data, not only through client-side route guards.
- Support multiple managed content domains and consistent draft, published, and archived lifecycle states.
- Do not silently substitute stale embedded content when canonical CMS data is unavailable.
- Isolate ISF in dedicated Supabase and Vercel projects; never reuse Baytul Asmaa data, users, storage, secrets, analytics, or deployment resources.
- Encode media type and approval state in the CMS so prohibited still imagery cannot be published accidentally.

## Maintenance State

- Environment: Vite application with Supabase project `vcngwmghpjpchcnpamyx` in `eu-central-1`; service Link verified 2026-06-22
- Content source of truth: Admin dashboard/CMS database
- Deployment target: dedicated Vercel project; project configuration pending
- Trigger: Not defined
- Observability: Not defined
- Recovery procedure: Not defined
