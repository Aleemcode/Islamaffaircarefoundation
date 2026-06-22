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
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(15_000),
  });
  return response;
}

function requireValue(env, name) {
  const value = env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function safeError(response, secrets) {
  if (response.ok) return null;
  let message = await response.clone().text();
  for (const secret of secrets) {
    if (secret) message = message.replaceAll(secret, '<redacted>');
  }
  message = message.replace(/eyJ[A-Za-z0-9._-]+/g, '<redacted-jwt>');
  return message.slice(0, 500);
}

const env = loadEnv('.env.local');
const accessToken = requireValue(env, 'SUPABASE_ACCESS_TOKEN');
const projectRef = requireValue(env, 'SUPABASE_PROJECT_REF');
const projectUrl = requireValue(env, 'VITE_SUPABASE_URL').replace(/\/$/, '');
const publishableKey = requireValue(env, 'VITE_SUPABASE_ANON_KEY');
const publishableKeyKind = publishableKey.startsWith('sb_publishable_')
  ? 'publishable'
  : publishableKey.startsWith('eyJ')
    ? 'legacy-anon-jwt'
    : publishableKey.startsWith('sb_secret_')
      ? 'secret-key-invalid-for-browser'
      : 'unrecognized';

const expectedUrl = `https://${projectRef}.supabase.co`;
if (projectUrl !== expectedUrl) {
  throw new Error('VITE_SUPABASE_URL does not match SUPABASE_PROJECT_REF');
}

const managementHeaders = { Authorization: `Bearer ${accessToken}` };
const clientHeaders = { apikey: publishableKey };

const projectResponse = await request(
  `https://api.supabase.com/v1/projects/${projectRef}`,
  { headers: managementHeaders },
);

if (!projectResponse.ok) {
  throw new Error(`Management API project check failed with HTTP ${projectResponse.status}`);
}

const project = await projectResponse.json();
const healthUrl = new URL(`https://api.supabase.com/v1/projects/${projectRef}/health`);
for (const service of ['auth', 'rest', 'storage', 'realtime']) {
  healthUrl.searchParams.append('services', service);
}

const [healthResponse, authResponse, restResponse] = await Promise.all([
  request(healthUrl, {
    headers: managementHeaders,
  }),
  request(`${projectUrl}/auth/v1/health`, { headers: clientHeaders }),
  request(`${projectUrl}/rest/v1/`, { headers: clientHeaders }),
]);

let services = [];
if (healthResponse.ok) {
  const health = await healthResponse.json();
  const entries = Array.isArray(health) ? health : health.services ?? [];
  services = entries.map((entry) => ({
    name: entry.name ?? entry.service ?? 'unknown',
    status: entry.status ?? entry.healthy ?? 'unknown',
  }));
}

console.log(JSON.stringify({
  projectRef,
  projectStatus: project.status ?? 'unknown',
  region: project.region ?? 'unknown',
  managementHealthHttp: healthResponse.status,
  managementHealthError: await safeError(healthResponse, [accessToken, publishableKey]),
  services,
  publishableKeyKind,
  authHttp: authResponse.status,
  authError: await safeError(authResponse, [accessToken, publishableKey]),
  restCatalogHttp: restResponse.status,
  restCatalogNote: restResponse.status === 401
    ? 'Expected before schema validation: catalog root requires a secret key.'
    : null,
}, null, 2));

if (!healthResponse.ok || !authResponse.ok) {
  process.exitCode = 1;
}
