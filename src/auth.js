import { getUserById } from './services/proxyServices';

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};

const getJwtFromProxy = async (proxyAuthToken) => {
  try {
    const response = await fetch(
      `https://routes.msg91.com/api/${process.env.PROXY_USER_REFERENCE_ID}/generateAuthToken`,
      {
        headers: {
          authkey: process.env.PROXY_ADMIN_TOKEN,
          Proxy_Auth_Token: proxyAuthToken,
        },
      },
    );
    const data = await response.json();
    return data?.data?.jwt || null;
  } catch (err) {
    return null;
  }
};

export const decodeToken = async (proxyAuthToken) => {
  if (!proxyAuthToken) return false;
  if (proxyAuthToken === process.env.ADMIN_TOKEN) return true;

  const jwtToken = await getJwtFromProxy(proxyAuthToken);
  if (!jwtToken) return false;

  const decoded = decodeJwtPayload(jwtToken);
  if (!decoded?.user || !decoded?.org) return false;

  const userFromDb = await getUserById(decoded.user.id);
  if (!userFromDb) return false;

  return {
    user: {
      fullName: userFromDb.name,
      id: userFromDb.id?.toString(),
      email: userFromDb.email,
      status: userFromDb.meta?.status,
      orgId: decoded.org?.id,
      orgName: decoded.org?.name,
    },
  };
};
