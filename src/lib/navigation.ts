export const publicNavItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: "Da'wah", href: '/resources' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
] as const;

export const adminModules = [
  'Dashboard overview',
  'Pages',
  'Programs and services',
  'Campaigns and appeals',
  'Activities and events',
  "Da'wah resources",
  'Impact stories and updates',
  'Media library',
  'Site settings',
  'Staff access and roles',
  'Audit history',
] as const;
