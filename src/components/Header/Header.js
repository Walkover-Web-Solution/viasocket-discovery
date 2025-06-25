import { useEffect, useState } from 'react';
import UserDetail from '../UserDetailPopup/UserDetailPopup';
import styles from './Header.module.scss';
import Avatar from '@mui/material/Avatar';
import  {useUser}  from '@/context/UserContext';
import { getCurrentEnvironment, setPathInLocalStorage } from '@/utils/storageHelper';

const Header = () => {
  const { user } = useUser();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(user ? true : false);
  }, [user]);
  const handleAuth = () => {
    setPathInLocalStorage()
  }

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };
  const loginUrl = (getCurrentEnvironment() !== 'prod')  ? 'http://localhost:3000/discovery/auth': 'https://viasocket.com/login?redirect_to=/discovery/auth&utm_source=/discovery';
  const signupUrl = (getCurrentEnvironment() !== 'prod') ? 'http://localhost:3000/discovery/auth': 'https://viasocket.com/signup?redirect_to=/discovery/auth&utm_source=/discovery';

  
  return (
    <header className={"d-flex justify-content-between align-items-center px-3 px-xl-5 border-bottom " + styles.headerDiv}>
      <a
        href="https://viasocket.com"
        target="_blank"
        aria-label="logo"
        className="via-logo-sm d-flex d-md-none justify-content-center align-items-center"
      >
        <img
          src="https://viasocket.com/assets/brand/socket_fav_dark.svg"
          alt="viasocket small logo"
          width="50"
          height="30px"
          loading="lazy"
        />
      </a>
      <a
        href="https://viasocket.com"
        target="_blank"
        aria-label="logo"
        class="via-logo d-none d-md-flex justify-content-center align-items-center"
      >
        <img
          src="https://viasocket.com/assets/brand/logo.svg"
          alt="viasocket logo"
          width="150"
          height="30px"
          loading="lazy"
        />
      </a>

      <nav class="d-flex align-items-center via-menu-lg">
        <a
          href="https://viasocket.com/discovery"
          class="px-4 text-decoration-none d-none d-lg-flex text-black justify-content-center"
          style={{
            borderLeft: "1px solid #ccc",
            minWidth: "120px",
            fontSize: "14px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          Discovery
        </a>
        <a
          href="https://viasocket.com/support"
          target="_blank"
          className = "px-4 text-decoration-none text-black d-none d-md-flex justify-content-center"
          style={{
            borderLeft: "1px solid #ccc",
            minWidth: "120px",
            fontSize: "14px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          Support
        </a>
        <a
          href="https://viasocket.com/pricing"
          target="_blank"
          className = "px-4 text-decoration-none text-black d-none d-sm-flex justify-content-center"
          style={{
            borderLeft: "1px solid #ccc",
            minWidth: "120px",
            fontSize: "14px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          Pricing
        </a>
        { !isLoggedIn ?
          <>
            <a
              href={loginUrl}
              className = "px-4 text-decoration-none btn rounded-0 d-flex justify-content-center"
              onClick={handleAuth}
              style={{
                borderLeft: "1px solid #ccc",
                minWidth: "120px",
                fontSize: "14px",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              Login
            </a>
            <a
              href={signupUrl}
              className = "px-4 text-white text-decoration-none btn rounded-0 d-flex justify-content-center"
              onClick={handleAuth}
              style={{
                borderLeft: "1px solid #ccc",
                minWidth: "120px",
                fontSize: "14px",
                paddingTop: "10px",
                paddingBottom: "10px",
                backgroundColor: "#a8200d",
              }}
            >
              Start free trial
            </a>
          </>
            :
            <>
              <strong role='button' className={` ${styles.viaIconBlack} ${styles.viaDropdown} d-flex justify-content-center align-items-center text-sm font-semibold px-4 text-decoration-none glass-effect`}  onClick = {toggleUserInfo}
                 style={{
                  borderLeft: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                  minWidth: "120px",
                  fontSize: "14px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              > 
                {user?.name ? user.name.split(" ")[0].charAt(0).toUpperCase() + user.name.split(" ")[0].slice(1) : ""} 
              </strong>
              <div className={styles.userDetailCatch}>
                <UserDetail isOpen={showUserInfo} onClose={toggleUserInfo} />
              </div>
            </>
          }
      </nav>
    </header>
  );
};

export default Header;
