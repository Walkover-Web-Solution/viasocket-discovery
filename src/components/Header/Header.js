import { useUser } from "@/context/UserContext";
import { useEffect, useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import UserDetail from "../UserDetailPopup/UserDetailPopup";
import styles from "./Header.module.scss";
import { setPathInLocalStorage } from "@/utils/storageHelper";

export default function Header() {
  const { user } = useUser();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null); 

  useEffect(() => {
    setIsLoggedIn(user ? true : false);
  }, [user]);
  const handleAuth = () => {
    setPathInLocalStorage()
  }

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false); 
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className = {styles.headerDiv}>
    <div
    className ={`container d-flex align-items-center justify-content-between py-5 ${styles.headerDiv}`}
    >
    <a href="https://viasocket.com">
      <img className={styles.viasocketLogo} src="https://viasocket.com/assets/brand/logo.svg" alt="Logo" />
    </a>
        <div className={styles.mobileMenuIcon} onClick={toggleMobileMenu}>
          {!isMobileMenuOpen && <FaBars size={24} />}
        </div>

        <div ref={menuRef} className={`${styles.navLinks} ${isMobileMenuOpen ? styles.showMobileMenu : ""}`}>
        <a class="text-decoration-none text-dark" target="_blank" href="/">Home</a>
        <a
        class="text-decoration-none text-dark"
        target="_blank"
        href="https://viasocket.com/faq/pricing"
        >Pricing</a
        >
        <a
        class="text-decoration-none text-dark"
        target="_blank"
        href="https://careers.walkover.in/jobs/Careers"
        >We are hiring</a
        >
        <a
        class="text-decoration-none text-dark"
        target="_blank"
        href="https://viasocket.com/support"
        >Support</a
        >
        <div class = "position-relative">
            {isLoggedIn ? (
                <>
                    <strong class="text-dark" style = {{cursor: "pointer"}} onClick = {toggleUserInfo}> {user?.email} </strong>
                    <UserDetail isOpen={showUserInfo} onClose={toggleUserInfo} />
                </>
            ) : (
                <div class="d-flex align-items-center gap-4">
                    <a href="https://viasocket.com/login?redirect_to=/discovery/auth&utm_source=/discovery">
                        <button class="btn btn-outline-dark" onClick={handleAuth}>Login</button>
                    </a>
                    <a href="https://viasocket.com/signup?redirect_to=/discovery/auth&utm_source=/discovery">
                        <button class="btn btn-dark text-white" onClick={handleAuth}>Sign Up</button>
                    </a>
                </div>
            )}
        </div>
    </div>
    </div>
    </div>
  )
}
