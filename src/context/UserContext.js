import { getUserDataFromLocalStorage } from '@/utils/storageHelper';
import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen,setIsChatOpen]=useState(false);
  useEffect(() => {
    const storedUser = getUserDataFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading ,isChatOpen ,setIsChatOpen}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
