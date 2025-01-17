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
    typeof document !== 'undefined' &&
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      <Head>
        <title>viaSocket Discovery</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/brand/favicon-16x16.png"></link>
        <script type="text/javascript" async="" src="https://www.googletagmanager.com/gtag/js?id=G-0DFEMF0FTJ&amp;l=dataLayer&amp;cx=c&amp;gtm=45He51d0v9194133166za200"></script>
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
        embedToken={process.env.NEXT_PUBLIC_CHAT_BOT_TOKEN} 
        hideIcon="true"
      /> */}
    </>
  );
}

export default MyApp;
