import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

const Protected = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('proxy_auth_token');
      if (!token) {
        router.push('/auth'); 
      }
    };

    checkAuth();
  }, [router]);
  return <>{children}</>;
};

Protected.propTypes = {
  children: PropTypes.node,
};

export default Protected;
