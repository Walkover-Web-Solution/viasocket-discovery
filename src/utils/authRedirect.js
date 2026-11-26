import { getCurrentEnvironment } from './storageHelper';

/** MSG91 callback on Discovery after viasocket.com auth (not the user's final page). */
export const DISCOVERY_AUTH_CALLBACK = '/discovery/auth';

const VIASOCKET_SIGNUP_URL = 'https://viasocket.com/signup';

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