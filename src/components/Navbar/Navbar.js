
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

import styles from "@/components/Navbar/Navbar.module.css";
import UserDetail from '../UserDetailPopup/UserDetailPopup';
import { useUser } from '@/context/UserContext';

export default function Navbar() {
    const { user } = useUser();

    const [showUserInfo, setShowUserInfo] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        setIsLoggedIn(user ? true : false)
    }, [user])

    const toggleUserInfo = () => {
        setShowUserInfo(!showUserInfo);
    };

    const handleSignIn = async () => {
        window.location.href = process.env.NEXT_PUBLIC_AUTH_REDIRECTION;
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.appName}>
                <a className={styles.AppName} href="/discovery/">App Discovery</a>
            </div>
             <div className={styles.userIconContainer}>
                {isLoggedIn ? (
                    <>
                        <FaUserCircle size={32} onClick={toggleUserInfo} />
                        <UserDetail isOpen={showUserInfo} onClose={toggleUserInfo} />
                    </>
                ) : (
                    <button onClick={handleSignIn} className={styles.signInButton}>
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
}
