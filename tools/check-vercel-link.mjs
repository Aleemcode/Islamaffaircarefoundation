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

function requireValue(env, name) {
  const value = env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function request(path, token) {
  return fetch(`https://api.vercel.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(15_000),
  });
}

async function safeJson(response, secrets) {
  const text = await response.clone().text();
  let redacted = text;
  for (const secret of secrets) {
    if (secret) redacted = redacted.replaceAll(secret, '<redacted>');
  }
  try {
    return JSON.parse(redacted);
  } catch {
    return { raw: redacted.slice(0, 500) };
  }
}

const env = loadEnv('.env.local');
const token = requireValue(env, 'VERCEL_TOKEN');
const teamId = env.VERCEL_TEAM_ID || '';

const userResponse = await request('/v2/user', token);
const userPayload = await safeJson(userResponse, [token]);

let teamResult = null;
if (teamId) {
  const teamResponse = await request(`/v2/teams/${teamId}`, token);
  const teamPayload = await safeJson(teamResponse, [token]);
  teamResult = {
    teamId,
    http: teamResponse.status,
    slug: teamPayload.slug ?? teamPayload.name ?? null,
    error: teamResponse.ok ? null : teamPayload,
  };
}

console.log(JSON.stringify({
  tokenPresent: true,
  userHttp: userResponse.status,
  username: userPayload.user?.username ?? userPayload.username ?? null,
  email: userPayload.user?.email ? '<redacted-email>' : null,
  personalAccountMode: !teamId,
  team: teamResult,
  userError: userResponse.ok ? null : userPayload,
}, null, 2));

if (!userResponse.ok || (teamResult && teamResult.http >= 400)) {
  process.exitCode = 1;
}
