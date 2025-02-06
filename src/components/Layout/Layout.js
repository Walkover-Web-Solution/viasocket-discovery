import { useUser } from "@/context/UserContext";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from './Layout.module.scss'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UnauthorizedPopup from "../UnauthorisedPopup/UnauthorisedPopup";
import UserBioPopup from "../UserBioPopup/UserBioPoup";
import { dispatchAskAiEvent } from "@/utils/utils";

export default function Layout({ children }) {
  const router = useRouter();
  const {user} = useUser();
  const [userBioPopup, setUserBioPopup] = useState(false);
  const [unAuthPopup, setUnAuthPopup] = useState(false);
  const isHomePage = router.pathname === '/';
  
  useEffect(() => {
    if (typeof document === 'undefined') return ;
    const handleEvent = async (e) => {
      if (!user) {
        setUnAuthPopup(true);
        return;
      }
      if(!user?.meta?.bio){
        setUserBioPopup(true);
        return;
      }
      if(e.detail?.callback)
        e.detail.callback();
    }
    window.addEventListener('askAppAiWithAuth', handleEvent);
    return () => {
      window.removeEventListener('askAppAiWithAuth', handleEvent);
    }
  }, [user]);


  return (
    <>
      <Header />
      <main className = {styles.main}>{children}</main>
      <UnauthorizedPopup isOpen={unAuthPopup} onClose={()=>setUnAuthPopup(false)} />
			<UserBioPopup isOpen={userBioPopup} onClose={()=>setUserBioPopup(false)}/>
      {!isHomePage &&  
        <Footer />
      }
    </>
  );
}
