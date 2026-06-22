# ISF System Blueprint

## Goal

Deliver a responsive public website that grows awareness and moves prospective donors toward supporting ISF's da'wah and welfare work, backed by a secure admin dashboard that serves as the website CMS.

## Reference Pattern

Follow the local Baytul Asmaa application's overall delivery approach:

- React and TypeScript application built with Vite
- React Router for public and protected admin routes
- Tailwind CSS for the design system
- Supabase Auth, Postgres, Storage, and Row Level Security
- Vercel hosting and web analytics

Provision dedicated ISF Supabase and Vercel projects. Do not share data, authentication users, storage, secrets, analytics, or deployment resources with Baytul Asmaa.

Reuse architectural conventions, not Baytul Asmaa content, branding, or its single-entry data model.

## Public Experience

Plan routes for:

- Home
- About ISF
- Programs and services
- Campaigns and appeals
- Activities and events
- Da'wah resources
- Impact stories and updates
- Get involved
- Donate, initially using an explicit non-functional placeholder
- Contact and official social channels

Only published CMS records may appear publicly. When canonical content cannot load, show a clear, non-deceptive degraded state.

The homepage may use a layered architectural city parallax as its narrative framework. Implement the experience as progressive enhancement with a composed static fallback, reduced motion support, simplified mobile layers, and content-independent decorative artwork.

## Admin CMS

Plan modules for:

- Dashboard overview
- Pages
- Programs and services
- Campaigns and appeals
- Activities and events
- Da'wah resources
- Impact stories and updates
- Media library
- Contact and global site settings
- SEO metadata
- Staff access and roles
- Audit history

Every managed content type should support a stable identifier, slug where public, draft/published/archived state, timestamps, author/editor attribution, and validation appropriate to that type.

## Authorization

Use Supabase authentication for staff sign-in. Require an explicit active staff profile and role before rendering or executing administrative operations. Enforce permissions again with database Row Level Security and storage policies.

Initial roles proposed for schema review:

- `owner`: manage staff, settings, and all content
- `admin`: manage and publish all content except ownership controls
- `editor`: create and edit content, with publishing permission determined during schema approval

## Media

Use Supabase Storage for approved illustrations, non-animate images, videos, and documents. Validate file type and size, store accessible alt text and attribution, and prevent untrusted uploads from becoming executable website content.

The CMS must record media category and approval state. Public still imagery may not contain conventional photographs or realistic depictions of humans, animals, or other animate beings. Faceless illustration and video are permitted under the behavioral rules. Provide compliant designed thumbnails for videos rather than default human portrait frames.

## Publication Workflow

Use `draft`, `published`, and `archived` lifecycle states. Record who changed content and when. Prefer archive over permanent deletion; reserve destructive deletion for authorized users with explicit confirmation.

## Deferred Work

- Payment-provider integration and donation transaction records
- Final hosting and Supabase credentials
- Exact database schema and validation contracts
- Final visual direction and content tone

Implementation remains blocked until the data contracts and remaining Blueprint decisions are approved.
