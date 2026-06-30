# Database SOP

## Goal

Implement the approved CMS contract in Supabase with versioned SQL migrations, Row Level Security, storage policy boundaries, and non-secret verification tools.

## Source Of Truth

The approved contract lives in `PROJECT_CONSTITUTION.md` as schema version `0.1.0`. Migrations must not introduce business rules that contradict that file.

## Migration Layout

- `supabase/migrations/20260623090000_cms_core.sql`: enums, tables, validation checks, RLS helper functions, policies, and storage bucket policies.
- `supabase/migrations/20260623091000_seed_site_settings.sql`: safe bootstrap settings only.

## Bootstrap Staff Rule

The first staff owner is intentionally not seeded because the owner id must be a real Supabase Auth user id. A service-role or SQL-dashboard bootstrap step must create the first `staff_profiles` row after the first authorized admin user exists.

Until that happens:

- public published reads remain available for eligible tables
- public inquiries may be inserted
- admin writes remain blocked by RLS for normal authenticated users
- service-role maintenance can perform controlled bootstrap actions

## Storage Rule

The `isf-media` bucket is private. Public object reads are allowed only when a matching `media_assets.storage_path` has `approval_status='approved'`. Staff may manage objects after they have an active staff profile.

## Verification

Run:

```bash
node tools/check-database-link.mjs
```

The checker reports table and RLS status, storage bucket visibility, and public REST status codes. It must not print database passwords, access tokens, or secret keys.
