import { getCurrentUser } from '@/utils/apiHelper';
import { getCurrentEnvironment, getFromCookies } from '@/utils/storageHelper';
import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
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
    const token = getFromCookies(getCurrentEnvironment())
    if (!token) { setUser(null); return }
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
    getCurrentUserFunction()
    window.clearUserGlobally = clearUser;
  }, []);
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
