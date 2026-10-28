/**
 * Shared A/B experiment helpers for the Automation Ideas site.
 *
 * The owner defines experiments in the middleware. This module does not
 * register an experiment and does not change what any page renders. Import
 * it from any page when an experiment should pick a variant or record an
 * exposure or conversion:
 *
 *   import { mwVariant, mwSend } from '@/utils/experiments';
 *
 *   const variant = await mwVariant('experiment-key');
 *   await mwSend('exposure', { experiment: 'experiment-key', variant });
 *   await mwSend('conversion', { experiment: 'experiment-key', variant });
 *
 * Both helpers no-op until these environment variables are set. Next.js
 * inlines NEXT_PUBLIC_ values at build time, so set them before
 * `next dev` or `npm run build:production`. Never commit the values.
 *
 *   NEXT_PUBLIC_MW_EVENTS_URL  events ingest URL
 *   NEXT_PUBLIC_MW_KEY         write key for that URL
 *
 * Locally they belong in `.env.local`. The production image build reads
 * `.env.production` via `npm run build:production`.
 *
 * Variant assignment is the middleware's decision. `mwVariant` posts
 * `{ type: 'variant', experiment, visitorId }` and expects
 * `{ variant: string }` or no variant. It does not choose one locally.
 * `mwSend` posts `{ type: 'event', name, visitorId, properties, url }`.
 * The write key is sent only as `Authorization: Bearer`.
 */

const EVENTS_URL = process.env.NEXT_PUBLIC_MW_EVENTS_URL;
const KEY = process.env.NEXT_PUBLIC_MW_KEY;

const VISITOR_STORAGE_KEY = 'mw-visitor-id';
const VARIANT_STORAGE_PREFIX = 'mw-variant:';

const variantRequests = new Map();

function isConfigured() {
  return typeof EVENTS_URL === 'string' && EVENTS_URL.length > 0
    && typeof KEY === 'string' && KEY.length > 0;
}

function readVisitorId() {
  if (typeof window === 'undefined') return null;
  try {
    const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing) return existing;
    const created = window.crypto && typeof window.crypto.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `mw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_STORAGE_KEY, created);
    return created;
  } catch (err) {
    return null;
  }
}

function readCachedVariant(experimentKey) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(VARIANT_STORAGE_PREFIX + experimentKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.variant !== 'string' || parsed.variant.length === 0) return null;
    return parsed.variant;
  } catch (err) {
    return null;
  }
}

function writeCachedVariant(experimentKey, variant) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      VARIANT_STORAGE_PREFIX + experimentKey,
      JSON.stringify({ variant }),
    );
  } catch (err) {
    // Storage can be blocked. The caller still receives this assignment.
  }
}

async function postJson(body) {
  const response = await fetch(EVENTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify(body),
    keepalive: true,
  });
  if (!response.ok) return null;
  if (response.status === 204) return {};
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return {};
  return response.json();
}

async function requestVariant(experimentKey) {
  const cached = readCachedVariant(experimentKey);
  if (cached) return cached;
  const data = await postJson({
    type: 'variant',
    experiment: experimentKey,
    visitorId: readVisitorId(),
  });
  const variant = data && typeof data.variant === 'string' ? data.variant.trim() : '';
  if (!variant) return null;
  writeCachedVariant(experimentKey, variant);
  return variant;
}

/**
 * Return the middleware-assigned variant for `experimentKey`, or null when
 * the helpers are unset, this is a server render, or no variant is assigned.
 */
export async function mwVariant(experimentKey) {
  if (!experimentKey || !isConfigured() || typeof window === 'undefined') return null;
  const cached = readCachedVariant(experimentKey);
  if (cached) return cached;
  const existing = variantRequests.get(experimentKey);
  if (existing) return existing;
  const pending = requestVariant(experimentKey)
    .catch(() => null)
    .finally(() => {
      variantRequests.delete(experimentKey);
    });
  variantRequests.set(experimentKey, pending);
  return pending;
}

/**
 * Record an exposure, conversion, or other named event.
 * No-ops when the events URL or key is unset, and never throws.
 */
export async function mwSend(name, properties = {}) {
  if (!name || !isConfigured()) return;
  try {
    await postJson({
      type: 'event',
      name,
      visitorId: readVisitorId(),
      properties: properties && typeof properties === 'object' ? properties : {},
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  } catch (err) {
    // Recording must not break the page.
  }
}
