import { getCurrentUser } from '@/utils/apiHelper';
import { getProxyAuthToken, persistProxyAuthTokenFromSearch } from '@/utils/storageHelper';
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen,setIsChatOpen]=useState(false);
  const getCurrentUserFunction = async  () => {
    // const storedUser = getUserDataFromLocalStorage();
    // if (storedUser) {
    //   setUser(storedUser);
    //   setLoading(false);
    //   return ;
    // }
    const token = getProxyAuthToken()
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const userInfo = await getCurrentUser();
    // localStorage.setItem("userDetail", JSON.stringify({ name: userData.name, email: userData.email, id: userData.id }));
    if(userInfo){
      const userData = userInfo?.data[0]
      setUser({
        name: userData.name,
        email: userData.email,
        id: userData.id,
        meta: userData.meta,
      });
    }
    setLoading(false);
  }
  useEffect(() => {
    const search =
      router.isReady && router.asPath.includes('?')
        ? `?${router.asPath.split('?')[1]}`
        : typeof window !== 'undefined'
          ? window.location.search
          : '';
    persistProxyAuthTokenFromSearch(search);
    getCurrentUserFunction();
    window.clearUserGlobally = clearUser;
  }, [router.isReady, router.asPath]);
  const clearUser = () => {
    setUser(null);
  };


  return (
    <UserContext.Provider value={{ user, setUser, loading ,isChatOpen ,setIsChatOpen,clearUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext) || {};
