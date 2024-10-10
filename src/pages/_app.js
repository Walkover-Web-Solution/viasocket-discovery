// pages/_app.js
import Layout from '@/components/Layout/Layout';
import { UserProvider } from '@/context/UserContext';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import '../globals.scss';
import Script from 'next/script';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>viaSocket Discovery</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/brand/favicon-16x16.png"></link>
      </Head>
      <UserProvider>
        <Layout >
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
