import { getCurrentUser } from '@/utils/apiHelper';
import { getCurrentEnvironment, getFromCookies, getUserDataFromLocalStorage } from '@/utils/storageHelper';
import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen,setIsChatOpen]=useState(false);
  const getCurrentUserFunction = async  () => {
    const storedUser = getUserDataFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
      return ;
    }
    const token = getFromCookies(getCurrentEnvironment())
    if (!token) return 
    const userInfo = await getCurrentUser();
    const userData = userInfo?.data[0]
    localStorage.setItem("userDetail", JSON.stringify({ name: userData.name, email: userData.email, id: userData.id }));
    setUser({ name: userData.name, email: userData.email, id: userData.id })
    setLoading(false);
  }
  useEffect(() => {
    getCurrentUserFunction()
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading ,isChatOpen ,setIsChatOpen}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
