import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import WithAuth from '@/components/auth/WithAuth';

import {
    getCurrentEnvironment,
    removeCookie,
    getRedirectPath,
    clearPath,
    getProxyAuthToken,
    persistProxyAuthTokenFromSearch,
} from '@/utils/storageHelper'
import { buildViasocketPanelUrl, DISCOVERY_AUTH_CALLBACK } from '@/utils/authRedirect'
import { getCurrentUser } from '@/utils/apiHelper'

export default function AuthPage() {
    const router = useRouter();
    const [hasStoredToken, setHasStoredToken] = useState(false);

    const persistTokenFromRoute = () => {
        const search = router.asPath.includes('?') ? `?${router.asPath.split('?')[1]}` : window.location.search
        return persistProxyAuthTokenFromSearch(search) || persistProxyAuthTokenFromSearch()
    }

    const redirectToHomePage = async () => {
        persistTokenFromRoute()
        const token = getProxyAuthToken()
        if (!token) return

        const userInfo = await getCurrentUser();
        const userData = userInfo?.data?.[0]
        if (!userData) {
            removeCookie(getCurrentEnvironment())
            localStorage.clear()
            sessionStorage.clear()
            return
        }
        const returnPath = getRedirectPath() || '/discovery'
        clearPath();
        window.location.href = returnPath
    }

    useEffect(() => {
        setHasStoredToken(Boolean(getProxyAuthToken()));
    }, []);

    useEffect(() => {
        if (!router.isReady) return

        async function runEffect() {
            persistTokenFromRoute()

            const hasToken = Boolean(
                persistTokenFromRoute() ||
                    router.query.proxy_auth_token ||
                    router.query.proxy_auth ||
                    getProxyAuthToken(),
            )

            if (!hasToken) {
                const redirectTo = router.query.redirect_to
                const msg91RedirectPath =
                    (Array.isArray(redirectTo) ? redirectTo[0] : redirectTo) ||
                    DISCOVERY_AUTH_CALLBACK
                const configuration = {
                    referenceId: process.env.NEXT_PUBLIC_NEXT_APP_REFERENCE_ID,
                    addInfo: {
                        redirect_path: msg91RedirectPath,
                    },
                    success: (data) => {
                        console.log('success response', data)
                    },
                    failure: (error) => {
                        console.log('failure reason', error)
                    },
                }

                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.onload = () => {
                    const checkInitVerification = setInterval(() => {
                        if (typeof initVerification === 'function') {
                            clearInterval(checkInitVerification)
                            // eslint-disable-next-line no-undef
                            initVerification(configuration)
                        }
                    }, 100)
                }
                script.src = 'https://proxy.msg91.com/assets/proxy-auth/proxy-auth.js'

                document.body.appendChild(script)
                return
            }

            await redirectToHomePage()
        }
        runEffect();
    }, [
        router.isReady,
        router.asPath,
        router.query.proxy_auth_token,
        router.query.proxy_auth,
    ])


    return (
        <WithAuth >
            <div className="auth-container d-flex justify-content-center align-items-center flex-grow-1 flex-column gap-3 text-center">
                {hasStoredToken && (
                    <p className="mb-0">
                        You are already signed in.{' '}
                        <a href={buildViasocketPanelUrl()}>Go to panel</a>
                    </p>
                )}
                <div id={process.env.NEXT_PUBLIC_NEXT_APP_REFERENCE_ID} />
            </div>
        </WithAuth>
    )
}