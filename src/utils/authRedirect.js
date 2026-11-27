import { getCurrentEnvironment, getProxyAuthToken } from './storageHelper';

/** MSG91 callback on Discovery after viasocket.com auth (not the user's final page). */
export const DISCOVERY_AUTH_CALLBACK = '/discovery/auth';

const VIASOCKET_SIGNUP_URL = 'https://viasocket.com/signup';
/** Signed-in viasocket product surface (`/login` 307s here). */
export const VIASOCKET_PANEL_URL = 'https://flow.viasocket.com';

export function buildViasocketPanelUrl() {
  if (getCurrentEnvironment() === 'local') {
    return '/discovery';
  }
  return VIASOCKET_PANEL_URL;
}

/**
 * Sign-in entry for unauthenticated users, or the panel when a proxy token is already stored.
 * Does not use viasocket.com `/login` (see INT-A8K2M9).
 */
export function getDiscoveryAuthEntry({ utmSource } = {}) {
  if (typeof window !== 'undefined' && getProxyAuthToken()) {
    return {
      href: buildViasocketPanelUrl(),
      label: 'Go to panel',
      usesSignup: false,
    };
  }
  return {
    href: buildViasocketSignInUrl({ utmSource }),
    label: 'Login',
    usesSignup: true,
  };
}

/**
 * URL for starting MSG91 login/signup on viasocket.com.
 * Uses /signup (not /login): /login 307s to flow.viasocket.com and breaks Discovery return.
 */
export function buildViasocketSignInUrl({ utmSource } = {}) {
  if (getCurrentEnvironment() === 'local') {
    return '/discovery/auth';
  }

  const params = new URLSearchParams({
    redirect_to: DISCOVERY_AUTH_CALLBACK,
  });
  if (utmSource) {
    params.set('utm_source', utmSource);
  }
  return `${VIASOCKET_SIGNUP_URL}?${params.toString()}`;
}

export function discoveryUtmSourceFromPath(asPath) {
  const routeSegments = asPath.split(/[?#]/, 1)[0].split('/').filter(Boolean);
  const discoverySegments =
    routeSegments[0] === 'discovery' ? routeSegments.slice(1) : routeSegments;
  const isBlogRoute =
    discoverySegments[0] === 'blog' && discoverySegments.length >= 4;
  if (isBlogRoute) {
    return `/discovery/${discoverySegments[1]}/${discoverySegments[discoverySegments.length - 1]}`;
  }
  return '/discovery';
}