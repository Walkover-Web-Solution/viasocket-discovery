import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import WithAuth from '@/components/auth/WithAuth';

import { getFromCookies, getCurrentEnvironment, removeCookie, getRedirectPath, clearPath } from '@/utils/storageHelper'
import { getCurrentUser } from '@/utils/apiHelper'

export default function AuthPage() {
    const router = useRouter();
    const queryParams = router.query;
    const redirectPath = getRedirectPath();

    const redirectToHomePage = async () => {
        const token = getFromCookies(getCurrentEnvironment())
        if (token) {
            const userInfo = await getCurrentUser();
            const userData = userInfo?.data[0]
            if (!userData) {
                removeCookie(getCurrentEnvironment())
                localStorage.clear()
                sessionStorage.clear()
            }
            clearPath();
            window.location.href= redirectPath ? redirectPath : '/automation-ideas'
        }
    }


    useEffect(() => {
        async function runEffect() {
            if (!queryParams['proxy_auth_token'] && !getFromCookies(getCurrentEnvironment())) {

                const configuration = {
                    referenceId: process.env.NEXT_PUBLIC_NEXT_APP_REFERENCE_ID,
                    addInfo: {
                        redirect_path: `/automation-ideas/auth`
                    },
                    success: (data) => {
                        console.log('success response', data)
                    },
                    failure: (error) => {
                        console.log('failure reason', error)
                    }
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
                redirectToHomePage()
            }
            redirectToHomePage();
        }
        runEffect();
    }, [queryParams, queryParams['proxy_auth_token']])


    return (
        <WithAuth >
            <div className="auth-container d-flex justify-content-center align-items-center flex-grow-1">
                <div id={process.env.NEXT_PUBLIC_NEXT_APP_REFERENCE_ID} />
            </div>
        </WithAuth>
    )
}
