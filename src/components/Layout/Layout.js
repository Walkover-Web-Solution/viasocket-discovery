import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from './Layout.module.scss'
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  return (
    <>
      <Header />
      <main className = {styles.main}>{children}</main>
      {!isHomePage &&  
        <Footer />
      }
    </>
  );
}
