# Cloud Link SOP

## Goal

Provision isolated ISF projects in Supabase and Vercel, then verify authentication, database, storage, and deployment connectivity without exposing credentials.

## Private Inputs

Store provisioning values only in the ignored `.env.local` file:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_ORG_SLUG`
- `SUPABASE_DB_PASSWORD`
- `VERCEL_TOKEN`
- `VERCEL_TEAM_ID` when deploying under a team

Never place credential values in project memory, logs, commits, or chat.

## Supabase Handshake

1. Create a dedicated project for ISF in the approved organization and region.
2. Record browser-safe project URL and publishable/anonymous key in local application configuration.
3. Apply the approved schema through versioned migrations.
4. Verify an anonymous public read is restricted to published content.
5. Verify an unauthenticated administrative write is rejected.
6. Verify authenticated role-based access and storage policy behavior.

Run the non-secret service check with:

```bash
node tools/check-supabase-link.mjs
```

The tool may report project identifiers, region, service names, health states, and HTTP status codes. It must never print credentials, connection strings, response bodies, or database passwords.

## Vercel Handshake

1. Create a dedicated ISF project without linking Baytul Asmaa resources.
2. Configure the approved build command and output directory.
3. Add browser-safe Supabase configuration to preview and production environments.
4. Deploy a minimal health build.
5. Verify the deployment URL, SPA routing, and analytics initialization.

## Evidence

Record only project identifiers, regions, timestamps, HTTP status summaries, and non-sensitive errors in `progress.md`. Keep tokens, passwords, and keys out of documentation.
