import { readFileSync } from 'node:fs';

function loadEnv(path) {
  const values = {};
  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    values[line.slice(0, separator)] = line.slice(separator + 1).trim();
  }
  return values;
}

async function request(url, options = {}) {
  return fetch(url, {
    ...options,
    signal: AbortSignal.timeout(15_000),
  });
}

function requireValue(env, name) {
  const value = env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function safeText(response, secrets) {
  if (response.ok) return null;
  let message = await response.clone().text();
  for (const secret of secrets) {
    if (secret) message = message.replaceAll(secret, '<redacted>');
  }
  message = message.replace(/eyJ[A-Za-z0-9._-]+/g, '<redacted-jwt>');
  return message.slice(0, 400);
}

const env = loadEnv('.env.local');
const projectUrl = requireValue(env, 'VITE_SUPABASE_URL').replace(/\/$/, '');
const anonKey = requireValue(env, 'VITE_SUPABASE_ANON_KEY');
const headers = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
};

const publicTables = [
  'site_settings',
  'pages',
  'programs',
  'campaigns',
  'activities',
  'dawah_resources',
  'stories',
  'impact_metrics',
];

const tableChecks = await Promise.all(
  publicTables.map(async (table) => {
    const response = await request(`${projectUrl}/rest/v1/${table}?select=*&limit=1`, { headers });
    return {
      table,
      http: response.status,
      error: await safeText(response, [anonKey]),
    };
  }),
);

const privateChecks = await Promise.all(
  ['staff_profiles', 'public_inquiries', 'audit_events'].map(async (table) => {
    const response = await request(`${projectUrl}/rest/v1/${table}?select=*&limit=1`, { headers });
    const text = await response.clone().text();
    const isBlocked = response.status === 401 || response.status === 403 || (response.status === 200 && text.trim() === '[]');
    return {
      table,
      http: response.status,
      blocked: isBlocked,
      error: isBlocked
        ? null
        : await safeText(response, [anonKey]),
    };
  }),
);

const storageResponse = await request(`${projectUrl}/storage/v1/bucket/isf-media`, { headers });

console.log(JSON.stringify({
  publicTables: tableChecks,
  privateTables: privateChecks,
  storageBucket: {
    id: 'isf-media',
    http: storageResponse.status,
    accessibleWithAnonKey: storageResponse.ok,
    error: await safeText(storageResponse, [anonKey]),
  },
}, null, 2));

const publicOk = tableChecks.every((check) => check.http === 200);
const privateOk = privateChecks.every((check) => check.blocked);
const bucketOk = storageResponse.status !== 404;

if (!publicOk || !privateOk || !bucketOk) {
  process.exitCode = 1;
}
