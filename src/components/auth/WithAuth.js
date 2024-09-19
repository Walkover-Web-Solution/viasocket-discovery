import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentEnvironment, setInCookies, getFromCookies } from '@/utils/storageHelper';

function WithAuth({ children }) {
  const router = useRouter();
  const domain = getCurrentEnvironment();
  const proxyKey = 'proxy_auth_token';

  useEffect(() => {
    const searchParams = new URLSearchParams(router.asPath.split('?')[1]);

    Array.from(searchParams?.entries()).forEach(([key, value]) => {
      if (key === proxyKey || key === 'state') {
        if (key === proxyKey) {
          localStorage.setItem(key, value);  // Store token in localStorage
          key = domain;
        }
        setInCookies(key, value);  // Store token in cookies
      }
    });

    if (!localStorage.getItem(proxyKey)) {
      localStorage.setItem(proxyKey, getFromCookies(domain));  // Sync token from cookies to localStorage
    }
  }, [router.asPath, domain]);  // Run effect when router path changes

  return children;
}

export default WithAuth;
