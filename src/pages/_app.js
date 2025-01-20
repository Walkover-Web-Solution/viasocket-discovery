// pages/_app.js
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Layout from '@/components/Layout/Layout';
import { UserProvider } from '@/context/UserContext';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import '../globals.scss';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <>
      <Head>
        <title>viaSocket Discovery</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/brand/favicon-16x16.png"/>
        <script type="text/javascript" async src="https://www.googletagmanager.com/gtag/js?id=G-0DFEMF0FTJ&l=dataLayer&cx=c&gtm=45He51d0v9194133166za200"></script>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-THTCRSLN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <script>
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
              var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
              j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j, f);
            })(window,document,'script','dataLayer','GTM-THTCRSLN');
          `}
        </script>
      </Head>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </UserProvider>

      {/* <Script
        id="chatbot-main-script"
        src="https://chatbot-embed.viasocket.com/chatbot-prod.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.embedToken = process.env.NEXT_PUBLIC_CHAT_BOT_TOKEN;
        }}
      /> */}
    </>
  );
}

export default MyApp;
