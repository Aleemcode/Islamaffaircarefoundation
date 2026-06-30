create extension if not exists pgcrypto;

do $$ begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.staff_role as enum ('owner', 'admin', 'editor');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_kind as enum ('faceless_illustration', 'non_animate_image', 'video', 'document');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_approval as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.campaign_status as enum ('planned', 'active', 'paused', 'completed', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.event_mode as enum ('physical', 'online', 'hybrid');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inquiry_type as enum ('general', 'volunteer', 'partnership', 'media', 'support');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inquiry_status as enum ('new', 'in_progress', 'resolved', 'spam');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.page_key as enum ('home', 'about', 'contact', 'get-involved', 'donate');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.page_section_type as enum ('hero', 'parallax_scene', 'rich_text', 'stats', 'cards', 'cta', 'faq', 'video');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.program_category as enum ('zakat_sadaqa', 'dawah', 'humanitarian_aid', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.resource_type as enum ('article', 'audio', 'video', 'document', 'link');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.review_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.story_type as enum ('impact', 'news', 'announcement', 'field_update');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.donation_mode as enum ('placeholder', 'enabled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.audit_action as enum ('create', 'update', 'publish', 'archive', 'restore', 'delete', 'approve', 'reject', 'role_change');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  role public.staff_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_staff_profiles_updated_at on public.staff_profiles;
create trigger set_staff_profiles_updated_at
before update on public.staff_profiles
for each row execute function public.set_updated_at();

create or replace function public.is_active_staff(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles
    where id = user_id
      and active = true
  );
$$;

create or replace function public.has_staff_role(user_id uuid, allowed_roles public.staff_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles
    where id = user_id
      and active = true
      and role = any(allowed_roles)
  );
$$;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  kind public.media_kind not null,
  approval_status public.media_approval not null default 'pending',
  storage_path text not null unique check (char_length(storage_path) between 1 and 500),
  file_name text not null check (char_length(file_name) between 1 and 255),
  mime_type text not null check (char_length(mime_type) between 1 and 160),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  duration_seconds numeric check (duration_seconds is null or duration_seconds > 0),
  alt_text text check (alt_text is null or char_length(alt_text) between 1 and 300),
  caption text check (caption is null or char_length(caption) <= 500),
  attribution text check (attribution is null or char_length(attribution) <= 300),
  uploaded_by uuid not null references public.staff_profiles(id),
  approved_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_still_metadata_required check (
    kind not in ('faceless_illustration', 'non_animate_image')
    or (alt_text is not null and width is not null and height is not null)
  ),
  constraint media_video_metadata_required check (
    kind <> 'video'
    or duration_seconds is not null
  ),
  constraint media_approval_requires_approver check (
    approval_status <> 'approved'
    or approved_by is not null
  )
);

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  page_key public.page_key not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 320),
  body text not null,
  status public.content_status not null default 'draft',
  featured_media_id uuid references public.media_assets(id),
  seo_title text check (seo_title is null or char_length(seo_title) <= 60),
  seo_description text check (seo_description is null or char_length(seo_description) <= 160),
  published_at timestamptz,
  created_by uuid not null references public.staff_profiles(id),
  updated_by uuid not null references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pages_published_at_required check (status <> 'published' or published_at is not null)
);

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type public.page_section_type not null,
  position integer not null check (position >= 0),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, position)
);

drop trigger if exists set_page_sections_updated_at on public.page_sections;
create trigger set_page_sections_updated_at
before update on public.page_sections
for each row execute function public.set_updated_at();

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 320),
  body text not null,
  status public.content_status not null default 'draft',
  featured_media_id uuid references public.media_assets(id),
  seo_title text check (seo_title is null or char_length(seo_title) <= 60),
  seo_description text check (seo_description is null or char_length(seo_description) <= 160),
  published_at timestamptz,
  created_by uuid not null references public.staff_profiles(id),
  updated_by uuid not null references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  category public.program_category not null,
  objectives text[] not null default '{}',
  service_regions text[] not null default '{}',
  eligibility_notes text check (eligibility_notes is null or char_length(eligibility_notes) <= 1000),
  contact_label text check (contact_label is null or char_length(contact_label) <= 80),
  contact_value text check (contact_value is null or char_length(contact_value) <= 200),
  featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  constraint programs_published_at_required check (status <> 'published' or published_at is not null),
  constraint programs_objectives_length check (array_length(objectives, 1) is null or array_length(objectives, 1) <= 12),
  constraint programs_regions_length check (array_length(service_regions, 1) is null or array_length(service_regions, 1) <= 20)
);

drop trigger if exists set_programs_updated_at on public.programs;
create trigger set_programs_updated_at
before update on public.programs
for each row execute function public.set_updated_at();

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 320),
  body text not null,
  status public.content_status not null default 'draft',
  featured_media_id uuid references public.media_assets(id),
  seo_title text check (seo_title is null or char_length(seo_title) <= 60),
  seo_description text check (seo_description is null or char_length(seo_description) <= 160),
  published_at timestamptz,
  created_by uuid not null references public.staff_profiles(id),
  updated_by uuid not null references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  program_id uuid references public.programs(id),
  campaign_status public.campaign_status not null default 'planned',
  goal_amount_minor bigint check (goal_amount_minor is null or goal_amount_minor > 0),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  raised_amount_minor bigint check (raised_amount_minor is null or raised_amount_minor >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  funding_note text check (funding_note is null or char_length(funding_note) <= 500),
  donation_enabled boolean not null default false,
  constraint campaigns_published_at_required check (status <> 'published' or published_at is not null),
  constraint campaigns_donation_disabled_initially check (donation_enabled = false),
  constraint campaigns_amount_currency_pair check (
    (goal_amount_minor is null and currency is null and raised_amount_minor is null)
    or (goal_amount_minor is not null and currency is not null)
  ),
  constraint campaigns_date_order check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

drop trigger if exists set_campaigns_updated_at on public.campaigns;
create trigger set_campaigns_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 320),
  body text not null,
  status public.content_status not null default 'draft',
  featured_media_id uuid references public.media_assets(id),
  seo_title text check (seo_title is null or char_length(seo_title) <= 60),
  seo_description text check (seo_description is null or char_length(seo_description) <= 160),
  published_at timestamptz,
  created_by uuid not null references public.staff_profiles(id),
  updated_by uuid not null references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  program_id uuid references public.programs(id),
  mode public.event_mode not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null check (char_length(timezone) between 1 and 80),
  venue_name text check (venue_name is null or char_length(venue_name) <= 160),
  address text check (address is null or char_length(address) <= 500),
  registration_url text check (registration_url is null or registration_url ~ '^https://'),
  registration_required boolean not null default false,
  constraint activities_published_at_required check (status <> 'published' or published_at is not null),
  constraint activities_date_order check (ends_at is null or ends_at >= starts_at),
  constraint activities_physical_venue_required check (
    mode = 'online'
    or (venue_name is not null and address is not null)
  )
);

drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at
before update on public.activities
for each row execute function public.set_updated_at();

create table if not exists public.dawah_resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 320),
  body text not null,
  status public.content_status not null default 'draft',
  featured_media_id uuid references public.media_assets(id),
  seo_title text check (seo_title is null or char_length(seo_title) <= 60),
  seo_description text check (seo_description is null or char_length(seo_description) <= 160),
  published_at timestamptz,
  created_by uuid not null references public.staff_profiles(id),
  updated_by uuid not null references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resource_type public.resource_type not null,
  speaker_or_author text check (speaker_or_author is null or char_length(speaker_or_author) <= 160),
  external_url text check (external_url is null or external_url ~ '^https://'),
  media_asset_id uuid references public.media_assets(id),
  topics text[] not null default '{}',
  review_status public.review_status not null default 'pending',
  reviewed_by uuid references public.staff_profiles(id),
  reviewed_at timestamptz,
  constraint dawah_resources_published_at_required check (status <> 'published' or published_at is not null),
  constraint dawah_resources_published_review_required check (
    status <> 'published'
    or (review_status = 'approved' and reviewed_by is not null and reviewed_at is not null)
  ),
  constraint dawah_resources_asset_or_url check (
    (external_url is null) <> (media_asset_id is null)
  )
);

drop trigger if exists set_dawah_resources_updated_at on public.dawah_resources;
create trigger set_dawah_resources_updated_at
before update on public.dawah_resources
for each row execute function public.set_updated_at();

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 320),
  body text not null,
  status public.content_status not null default 'draft',
  featured_media_id uuid references public.media_assets(id),
  seo_title text check (seo_title is null or char_length(seo_title) <= 60),
  seo_description text check (seo_description is null or char_length(seo_description) <= 160),
  published_at timestamptz,
  created_by uuid not null references public.staff_profiles(id),
  updated_by uuid not null references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  story_type public.story_type not null,
  program_id uuid references public.programs(id),
  campaign_id uuid references public.campaigns(id),
  occurred_on date,
  location_label text check (location_label is null or char_length(location_label) <= 160),
  evidence_note text check (evidence_note is null or char_length(evidence_note) <= 500),
  featured boolean not null default false,
  constraint stories_published_at_required check (status <> 'published' or published_at is not null),
  constraint stories_impact_evidence_required check (story_type <> 'impact' or evidence_note is not null)
);

drop trigger if exists set_stories_updated_at on public.stories;
create trigger set_stories_updated_at
before update on public.stories
for each row execute function public.set_updated_at();

create table if not exists public.impact_metrics (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 1 and 100),
  value numeric not null check (value >= 0),
  unit text not null check (char_length(unit) between 1 and 40),
  period_start date not null,
  period_end date not null,
  program_id uuid references public.programs(id),
  source_note text not null check (char_length(source_note) between 1 and 500),
  status public.content_status not null default 'draft',
  created_by uuid not null references public.staff_profiles(id),
  updated_by uuid not null references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint impact_metrics_period_order check (period_end >= period_start)
);

drop trigger if exists set_impact_metrics_updated_at on public.impact_metrics;
create trigger set_impact_metrics_updated_at
before update on public.impact_metrics
for each row execute function public.set_updated_at();

create table if not exists public.site_settings (
  id boolean primary key default true,
  organization_name text not null check (char_length(organization_name) between 1 and 160),
  short_name text not null check (char_length(short_name) between 1 and 40),
  primary_email text check (primary_email is null or primary_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  primary_phone text check (primary_phone is null or primary_phone ~ '^\+[1-9][0-9]{7,14}$'),
  address text check (address is null or char_length(address) <= 500),
  instagram_url text check (instagram_url is null or instagram_url ~ '^https://'),
  facebook_url text check (facebook_url is null or facebook_url ~ '^https://'),
  donation_mode public.donation_mode not null default 'placeholder',
  donation_message text not null check (char_length(donation_message) between 1 and 300),
  updated_by uuid references public.staff_profiles(id),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = true),
  constraint site_settings_donation_placeholder_initially check (donation_mode = 'placeholder')
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create table if not exists public.public_inquiries (
  id uuid primary key default gen_random_uuid(),
  type public.inquiry_type not null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  subject text not null check (char_length(subject) between 1 and 160),
  message text not null check (char_length(message) between 1 and 3000),
  consent boolean not null check (consent = true),
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.staff_profiles(id),
  action public.audit_action not null,
  entity_type text not null check (char_length(entity_type) between 1 and 80),
  entity_id text not null check (char_length(entity_id) between 1 and 120),
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create index if not exists pages_status_idx on public.pages(status, published_at desc);
create index if not exists programs_status_idx on public.programs(status, sort_order, published_at desc);
create index if not exists campaigns_status_idx on public.campaigns(status, campaign_status, published_at desc);
create index if not exists activities_status_idx on public.activities(status, starts_at desc);
create index if not exists dawah_resources_status_idx on public.dawah_resources(status, review_status, published_at desc);
create index if not exists stories_status_idx on public.stories(status, story_type, published_at desc);
create index if not exists impact_metrics_status_idx on public.impact_metrics(status, period_end desc);
create index if not exists public_inquiries_status_idx on public.public_inquiries(status, created_at desc);

alter table public.staff_profiles enable row level security;
alter table public.media_assets enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.programs enable row level security;
alter table public.campaigns enable row level security;
alter table public.activities enable row level security;
alter table public.dawah_resources enable row level security;
alter table public.stories enable row level security;
alter table public.impact_metrics enable row level security;
alter table public.site_settings enable row level security;
alter table public.public_inquiries enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "staff profiles readable by self or admins" on public.staff_profiles;
create policy "staff profiles readable by self or admins"
on public.staff_profiles for select
to authenticated
using (id = auth.uid() or public.has_staff_role(auth.uid(), array['owner', 'admin']::public.staff_role[]));

drop policy if exists "owners manage staff profiles" on public.staff_profiles;
create policy "owners manage staff profiles"
on public.staff_profiles for all
to authenticated
using (public.has_staff_role(auth.uid(), array['owner']::public.staff_role[]))
with check (public.has_staff_role(auth.uid(), array['owner']::public.staff_role[]));

drop policy if exists "approved media assets are public" on public.media_assets;
create policy "approved media assets are public"
on public.media_assets for select
to anon, authenticated
using (approval_status = 'approved');

drop policy if exists "staff manage media assets" on public.media_assets;
create policy "staff manage media assets"
on public.media_assets for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "published pages are public" on public.pages;
create policy "published pages are public"
on public.pages for select
to anon, authenticated
using (status = 'published');

drop policy if exists "staff manage pages" on public.pages;
create policy "staff manage pages"
on public.pages for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "published page sections are public" on public.page_sections;
create policy "published page sections are public"
on public.page_sections for select
to anon, authenticated
using (exists (select 1 from public.pages where pages.id = page_sections.page_id and pages.status = 'published'));

drop policy if exists "staff manage page sections" on public.page_sections;
create policy "staff manage page sections"
on public.page_sections for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "published programs are public" on public.programs;
create policy "published programs are public"
on public.programs for select
to anon, authenticated
using (status = 'published');

drop policy if exists "staff manage programs" on public.programs;
create policy "staff manage programs"
on public.programs for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "published campaigns are public" on public.campaigns;
create policy "published campaigns are public"
on public.campaigns for select
to anon, authenticated
using (status = 'published');

drop policy if exists "staff manage campaigns" on public.campaigns;
create policy "staff manage campaigns"
on public.campaigns for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "published activities are public" on public.activities;
create policy "published activities are public"
on public.activities for select
to anon, authenticated
using (status = 'published');

drop policy if exists "staff manage activities" on public.activities;
create policy "staff manage activities"
on public.activities for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "approved published dawah resources are public" on public.dawah_resources;
create policy "approved published dawah resources are public"
on public.dawah_resources for select
to anon, authenticated
using (status = 'published' and review_status = 'approved');

drop policy if exists "staff manage dawah resources" on public.dawah_resources;
create policy "staff manage dawah resources"
on public.dawah_resources for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "published stories are public" on public.stories;
create policy "published stories are public"
on public.stories for select
to anon, authenticated
using (status = 'published');

drop policy if exists "staff manage stories" on public.stories;
create policy "staff manage stories"
on public.stories for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "published impact metrics are public" on public.impact_metrics;
create policy "published impact metrics are public"
on public.impact_metrics for select
to anon, authenticated
using (status = 'published');

drop policy if exists "staff manage impact metrics" on public.impact_metrics;
create policy "staff manage impact metrics"
on public.impact_metrics for all
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "site settings are public" on public.site_settings;
create policy "site settings are public"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "owners and admins manage site settings" on public.site_settings;
create policy "owners and admins manage site settings"
on public.site_settings for all
to authenticated
using (public.has_staff_role(auth.uid(), array['owner', 'admin']::public.staff_role[]))
with check (public.has_staff_role(auth.uid(), array['owner', 'admin']::public.staff_role[]));

drop policy if exists "public can create inquiries" on public.public_inquiries;
create policy "public can create inquiries"
on public.public_inquiries for insert
to anon, authenticated
with check (consent = true and status = 'new' and resolved_at is null);

drop policy if exists "staff read inquiries" on public.public_inquiries;
create policy "staff read inquiries"
on public.public_inquiries for select
to authenticated
using (public.is_active_staff(auth.uid()));

drop policy if exists "staff update inquiries" on public.public_inquiries;
create policy "staff update inquiries"
on public.public_inquiries for update
to authenticated
using (public.is_active_staff(auth.uid()))
with check (public.is_active_staff(auth.uid()));

drop policy if exists "staff read audit events" on public.audit_events;
create policy "staff read audit events"
on public.audit_events for select
to authenticated
using (public.is_active_staff(auth.uid()));

drop policy if exists "staff create audit events" on public.audit_events;
create policy "staff create audit events"
on public.audit_events for insert
to authenticated
with check (public.is_active_staff(auth.uid()) and actor_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'isf-media',
  'isf-media',
  false,
  52428800,
  array[
    'image/svg+xml',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/webm'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "approved isf media objects are public" on storage.objects;
create policy "approved isf media objects are public"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'isf-media'
  and exists (
    select 1
    from public.media_assets
    where media_assets.storage_path = storage.objects.name
      and media_assets.approval_status = 'approved'
  )
);

drop policy if exists "staff manage isf media objects" on storage.objects;
create policy "staff manage isf media objects"
on storage.objects for all
to authenticated
using (bucket_id = 'isf-media' and public.is_active_staff(auth.uid()))
with check (bucket_id = 'isf-media' and public.is_active_staff(auth.uid()));
