// pages/_app.js
import Layout from '@/components/Layout/Layout';
import { UserProvider } from '@/context/UserContext';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import '../globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <UserProvider>
        <Layout >
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </UserProvider>
    </>
  );
}

export default MyApp;
