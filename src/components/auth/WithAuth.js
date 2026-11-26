import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  getCurrentEnvironment,
  setInCookies,
  getFromCookies,
  persistProxyAuthTokenFromSearch,
  PROXY_AUTH_KEY,
  PROXY_AUTH_QUERY_KEYS,
} from '@/utils/storageHelper';

function WithAuth({ children }) {
  const router = useRouter();
  const domain = getCurrentEnvironment();

  useEffect(() => {
    const search = router.asPath.includes('?') ? `?${router.asPath.split('?')[1]}` : '';
    persistProxyAuthTokenFromSearch(search);
    const searchParams = new URLSearchParams(router.asPath.split('?')[1] || '');

    Array.from(searchParams?.entries()).forEach(([key, value]) => {
      const isProxyAuthKey = PROXY_AUTH_QUERY_KEYS.includes(key);
      if (isProxyAuthKey || key === 'state') {
        if (isProxyAuthKey) {
          localStorage.setItem(PROXY_AUTH_KEY, value);
          setInCookies(domain, value);
        } else {
          setInCookies(key, value);
        }
      }
    });

    if (!localStorage.getItem(PROXY_AUTH_KEY)) {
      const fromCookie = getFromCookies(domain);
      if (fromCookie) {
        localStorage.setItem(PROXY_AUTH_KEY, fromCookie);
      }
    }
  }, [router.asPath, domain]);  // Run effect when router path changes

  return children;
}

export default WithAuth;
