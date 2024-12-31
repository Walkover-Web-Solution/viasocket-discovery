// pages/_app.js
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Layout from '@/components/Layout/Layout';
import { UserProvider, useUser } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import '../globals.scss';
import Head from 'next/head';
import UnauthorizedPopup from '@/components/UnauthorisedPopup/UnauthorisedPopup';
import UserBioPopup from '@/components/UserBioPopup/UserBioPoup';

function MyApp({ Component, pageProps }) {
  const {user} = useUser();
  const [userBioPopup, setUserBioPopup] = useState(false);
  const [unAuthPopup, setUnAuthPopup] = useState(false);
  useEffect(() => {
    typeof document !== 'undefined' &&
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
      const handleEvent = async (e) => {
        if (!user) {
          setUnAuthPopup(true);
          return;
        }
        if(!user.meta?.bio){
          setUserBioPopup(true);
          return;
        }
        setSearchQuery('');
        dispatchAskAiEvent(e.detail.message);
        if(e.detail?.callback)
          e.detail.callback();
      }
      window.addEventListener('askAppAiWithAuth', handleEvent);
      return () => {
        window.removeEventListener('askAppAiWithAuth', handleEvent);
      }
  }, []);

  return (
    <>
      <Head>
        <title>viaSocket Discovery</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/brand/favicon-16x16.png"></link>
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
      <UnauthorizedPopup isOpen={unAuthPopup} onClose={()=>setUnAuthPopup(false)} />
			<UserBioPopup isOpen={userBioPopup} onClose={()=>setUserBioPopup(false)}/>
    </>
  );
}

export default MyApp;
