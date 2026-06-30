insert into public.site_settings (
  id,
  organization_name,
  short_name,
  instagram_url,
  facebook_url,
  donation_mode,
  donation_message
)
values (
  true,
  'Islamaffairs Foundation',
  'ISF',
  'https://www.instagram.com/islamaffaircarefoundation/',
  'https://web.facebook.com/Islamaffair.f/',
  'placeholder',
  'Online donations are not active yet. Payment details will be added only after ISF approves a provider and workflow.'
)
on conflict (id) do update
set organization_name = excluded.organization_name,
    short_name = excluded.short_name,
    instagram_url = excluded.instagram_url,
    facebook_url = excluded.facebook_url,
    donation_mode = excluded.donation_mode,
    donation_message = excluded.donation_message,
    updated_at = now();
