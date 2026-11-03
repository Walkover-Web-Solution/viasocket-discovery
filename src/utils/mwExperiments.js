// Shared experiment client. The owner defines experiments in the middleware.
// This module only lets a page ask for a variant and record an exposure or
// conversion. It does not register an experiment and it does not change a page
// on its own.
//
// The owner sets these in the site environment (never in source):
//   NEXT_PUBLIC_MW_EVENTS_URL  events ingest URL
//   NEXT_PUBLIC_MW_KEY         ingest key sent as the x-mw-key header
// Next.js inlines NEXT_PUBLIC_ variables at build time. Set them in .env.local
// for `npm run dev`, and in .env.production for `npm run build:production`.

const VISITOR_STORAGE_KEY = 'mw.visitor';
const VARIANT_STORAGE_PREFIX = 'mw.variant.';
const DEFAULT_VARIANTS = ['control', 'treatment'];

const memory = {
  visitorId: null,
  variants: new Map(),
};

function eventsConfig() {
  return {
    url: process.env.NEXT_PUBLIC_MW_EVENTS_URL,
    key: process.env.NEXT_PUBLIC_MW_KEY,
  };
}

function readStore() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

function writeStore(store, key, value) {
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch (error) {
    // A blocked or full store must not break the page.
  }
}

export function assignVariant(seed, experiment, variants) {
  if (!seed || !experiment || !Array.isArray(variants) || variants.length === 0) {
    return null;
  }
  const input = `${seed}\0${experiment}`;
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return variants[(hash >>> 0) % variants.length];
}

function visitorId() {
  if (memory.visitorId) return memory.visitorId;
  const store = readStore();
  const existing = store ? store.getItem(VISITOR_STORAGE_KEY) : null;
  if (existing) {
    memory.visitorId = existing;
    return existing;
  }
  const created = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  memory.visitorId = created;
  writeStore(store, VISITOR_STORAGE_KEY, created);
  return created;
}

export function mwVariant(experiment, variants = DEFAULT_VARIANTS) {
  if (typeof window === 'undefined') return null;
  if (typeof experiment !== 'string' || experiment.length === 0) return null;
  if (!Array.isArray(variants) || variants.length === 0) return null;

  const unique = variants.filter((variant, index) => (
    typeof variant === 'string'
    && variant.length > 0
    && variants.indexOf(variant) === index
  ));
  if (unique.length === 0) return null;

  const storageKey = `${VARIANT_STORAGE_PREFIX}${experiment}`;
  const store = readStore();
  const stored = store ? store.getItem(storageKey) : memory.variants.get(experiment);
  if (stored && unique.includes(stored)) return stored;

  const variant = assignVariant(visitorId(), experiment, unique);
  if (!variant) return null;
  memory.variants.set(experiment, variant);
  writeStore(store, storageKey, variant);
  return variant;
}

export function mwSend(type, fields = {}) {
  if (type !== 'exposure' && type !== 'conversion') {
    return Promise.resolve({ ok: false, skipped: true });
  }

  const { url, key } = eventsConfig();
  if (!url || !key) {
    return Promise.resolve({ ok: false, skipped: true });
  }

  const payload = {
    type,
    experiment: fields.experiment ?? null,
    variant: fields.variant ?? null,
    name: fields.name ?? null,
    visitorId: typeof window === 'undefined' ? null : visitorId(),
    sentAt: new Date().toISOString(),
  };
  if (fields.properties && typeof fields.properties === 'object') {
    payload.properties = fields.properties;
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mw-key': key,
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).then((response) => ({
    ok: response.ok,
    status: response.status,
  })).catch(() => ({ ok: false }));
}
