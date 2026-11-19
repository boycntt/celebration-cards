const DEFAULT_INTERVAL_MS = 5 * 60 * 1000;
const MIN_INTERVAL_MS = 30 * 1000;
const WARMUP_DELAY_MS = 15 * 1000;
const REQUEST_TIMEOUT_MS = 10 * 1000;
const DEFAULT_PUBLIC_URL = 'https://celebration-cards.onrender.com';

let intervalTimer = null;
let warmupTimer = null;
let tickInProgress = false;
let observedOrigin = '';

const state = {
  enabled: true,
  intervalMs: DEFAULT_INTERVAL_MS,
  targetUrl: '',
  lastPingAt: null,
  lastSuccessAt: null,
  lastStatusCode: null,
  lastError: null,
  totalPings: 0,
  consecutiveFailures: 0,
};

function isHeartbeatEnabled() {
  const raw = process.env.HEARTBEAT_ENABLED;
  if (raw === undefined || raw === null) {
    return true;
  }
  return String(raw).trim().toLowerCase() !== 'false';
}

function resolveIntervalMs() {
  const raw = process.env.HEARTBEAT_INTERVAL_MS;
  if (!raw) {
    return DEFAULT_INTERVAL_MS;
  }
  const parsed = Number.parseInt(String(raw), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_INTERVAL_MS;
  }
  return Math.max(parsed, MIN_INTERVAL_MS);
}

function normalizeUrlCandidate(rawValue, allowBareHostname = false) {
  if (typeof rawValue !== 'string') {
    return '';
  }
  const trimmed = rawValue.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return '';
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (allowBareHostname && /^[a-z0-9.-]+(:\d{1,5})?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return '';
}

function resolveEnvTargetUrl() {
  const candidates = [
    [process.env.HEARTBEAT_URL, false],
    [process.env.RENDER_EXTERNAL_URL, false],
    [process.env.RENDER_EXTERNAL_HOSTNAME, true],
    [process.env.PUBLIC_BASE_URL, false],
  ];
  for (const [candidate, allowBareHostname] of candidates) {
    const normalized = normalizeUrlCandidate(candidate, allowBareHostname);
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function resolveTargetUrl() {
  const explicitOrObserved = resolveEnvTargetUrl() || observedOrigin;
  if (explicitOrObserved) {
    return explicitOrObserved;
  }
  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_PUBLIC_URL;
  }
  return '';
}

function isLocalHost(host) {
  const lower = host.toLowerCase();
  if (lower.startsWith('[::1]')) {
    return true;
  }
  const hostname = lower.split(':')[0];
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1'
  );
}

export function registerObservedOrigin(req) {
  if (resolveEnvTargetUrl() || observedOrigin) {
    return;
  }

  const rawHost =
    typeof req?.get === 'function' ? req.get('host') : req?.headers?.host;
  if (typeof rawHost !== 'string') {
    return;
  }

  const host = rawHost.trim();
  if (!host || !/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host) || isLocalHost(host)) {
    return;
  }

  const hostname = host.split(':')[0].toLowerCase();
  const protocol =
    hostname.endsWith('.onrender.com') || req?.protocol !== 'http' ? 'https' : 'http';

  observedOrigin = `${protocol}://${host}`;
  state.targetUrl = observedOrigin;
}

function buildHealthEndpointUrl(targetUrl) {
  if (/\/api\/(health|heartbeat)$/i.test(targetUrl)) {
    return `${targetUrl}?source=self`;
  }
  return `${targetUrl}/api/health?source=self`;
}

async function warmActiveCardRoutes(baseUrl, getActiveSlugs) {
  if (typeof getActiveSlugs !== 'function' || /\/api\/(health|heartbeat)$/i.test(baseUrl)) {
    return;
  }
  const slugs = getActiveSlugs();
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return;
  }

  for (const slug of slugs) {
    if (typeof slug !== 'string' || !slug.trim()) {
      continue;
    }
    const routeUrl = `${baseUrl}/${encodeURIComponent(slug.trim())}?source=self-warmup`;
    await fetch(routeUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'CelebrationCards-Heartbeat/1.0',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    }).catch(() => {});
  }
}

export async function runHeartbeatTick({
  pingDb,
  getActiveSlugs,
  targetUrl,
} = {}) {
  if (tickInProgress) {
    return;
  }
  tickInProgress = true;

  try {
    if (typeof pingDb === 'function') {
      await pingDb().catch(() => {});
    }

    const effectiveTarget =
      typeof targetUrl === 'string' && /^https?:\/\//i.test(targetUrl.trim())
        ? targetUrl.trim().replace(/\/+$/, '')
        : resolveTargetUrl();

    if (!effectiveTarget) {
      return;
    }

    state.targetUrl = effectiveTarget;
    const endpointUrl = buildHealthEndpointUrl(effectiveTarget);
    const nowIso = new Date().toISOString();
    state.totalPings += 1;
    state.lastPingAt = nowIso;

    try {
      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'CelebrationCards-Heartbeat/1.0',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      state.lastStatusCode = response.status;
      if (response.ok) {
        state.lastSuccessAt = new Date().toISOString();
        state.lastError = null;
        state.consecutiveFailures = 0;
        await warmActiveCardRoutes(effectiveTarget, getActiveSlugs);
      } else {
        state.consecutiveFailures += 1;
        state.lastError = `HTTP ${response.status}`;
        console.warn(`[server:heartbeat] Self-ping returned HTTP ${response.status}`);
      }
    } catch (err) {
      state.lastStatusCode = null;
      state.consecutiveFailures += 1;
      state.lastError = err instanceof Error ? err.message : 'Heartbeat request failed';
      console.warn(`[server:heartbeat] Self-ping failed: ${state.lastError}`);
    }
  } finally {
    tickInProgress = false;
  }
}

export function startHeartbeat({ pingDb, getActiveSlugs } = {}) {
  stopHeartbeat();

  const enabled = isHeartbeatEnabled();
  const intervalMs = resolveIntervalMs();
  const targetUrl = resolveTargetUrl();

  state.enabled = enabled;
  state.intervalMs = intervalMs;
  state.targetUrl = targetUrl;

  if (!enabled) {
    console.log('[server:heartbeat] Disabled via HEARTBEAT_ENABLED=false.');
    return;
  }

  warmupTimer = setTimeout(() => {
    warmupTimer = null;
    runHeartbeatTick({ pingDb, getActiveSlugs }).catch(() => {});
  }, WARMUP_DELAY_MS);
  if (typeof warmupTimer.unref === 'function') {
    warmupTimer.unref();
  }

  intervalTimer = setInterval(() => {
    runHeartbeatTick({ pingDb, getActiveSlugs }).catch(() => {});
  }, intervalMs);
  if (typeof intervalTimer.unref === 'function') {
    intervalTimer.unref();
  }

  console.log(
    `[server:heartbeat] Started (interval=${Math.round(intervalMs / 1000)}s, targetConfigured=${Boolean(targetUrl)}).`
  );
}

export function stopHeartbeat() {
  if (warmupTimer) {
    clearTimeout(warmupTimer);
    warmupTimer = null;
  }
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
}

export function getHeartbeatStatus() {
  return {
    enabled: state.enabled,
    intervalMs: state.intervalMs,
    targetConfigured: Boolean(state.targetUrl || resolveTargetUrl()),
    lastPingAt: state.lastPingAt,
    lastSuccessAt: state.lastSuccessAt,
    lastStatusCode: state.lastStatusCode,
    lastError: state.lastError,
    totalPings: state.totalPings,
    consecutiveFailures: state.consecutiveFailures,
  };
}
