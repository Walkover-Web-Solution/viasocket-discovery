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
    <header className={"d-flex justify-content-between " + styles.headerDiv}>
      <a
        aria-label="logo"
        className={`${styles.viaLogoSm} d-flex d-md-none justify-content-center align-items-center border border-dark px-2`}
        target="_blank"
        href="https://viasocket.com"
      >
        <img
          alt="viasocket"
          src="https://viasocket.com/assets/brand/socket_fav_dark.svg"
          loading="lazy"
        />
      </a>
      <a
        aria-label="logo"
        className={`${styles.viaLogo} d-none d-md-flex justify-content-center align-items-center border border-dark px-4 glass-effect`}
        target="_blank"
        href="https://viasocket.com"
      >
        <img
          alt="viasocket"
          src="https://viasocket.com/assets/brand/logo.svg"
          loading="lazy"
        />
      </a>

      {/* Navigation Links */}
      <nav className={styles.viaMenu}>
        <div className={`d-none d-lg-flex ${styles.viaMenuLg}`}>
          <a
            target="_blank"
            href="https://viasocket.com/pricing"
            className="d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark p-2 text-decoration-none glass-effect"
          >
            Pricing
          </a>
          <a
            href="https://viasocket.com/discovery"
            className={`d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark p-2 text-decoration-none glass-effect ${styles.discoveryOnHeader}`}
          >
            Discovery
          </a>
          <a
            target="_self"
            href="https://viasocket.com/support"
            className="d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark p-2 text-decoration-none glass-effect"
          >
            Support
          </a>
          { !isLoggedIn ?
          <>
            <a
              href={loginUrl}
              className="d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark p-2 text-decoration-none glass-effect"
              onClick={handleAuth}
            >
              Login
            </a>
            <a
              href={signupUrl}
              className={`d-flex justify-content-center align-items-center text-sm font-semibold border border-dark p-2 text-decoration-none ${styles.viaBgAccent}`}
              onClick={handleAuth}
            >
              Sign Up
            </a>
          </>
            :
            <>
              <strong role='button' className={` d-flex justify-content-center align-items-center text-sm font-semibold border  border-dark px-4 text-decoration-none glass-effect`}  onClick = {toggleUserInfo}> {user?.name} </strong>
              <div className={styles.userDetailCatch}>
                <UserDetail isOpen={showUserInfo} onClose={toggleUserInfo} />
              </div>
            </>
          }
          
        </div>
        <div className={`d-flex d-lg-none ${styles.viaMenuSm}`}>
          <a
            href={loginUrl}
            onClick={handleAuth}
            className={`${styles.viaIconBlack} d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark p-2 text-decoration-none`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
              <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
            </svg>
          </a>
         {!isLoggedIn ?  <a
            href={signupUrl}
            className={`d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark p-2 text-decoration-none ${styles.viaBgAccent}`}
            onClick={handleAuth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
              <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
            </svg>
          </a>
          :
          <>
            {/* <strong class="text-dark d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark p-2 text-decoration-none glass-effect" style = {{cursor: "pointer"}} onClick = {toggleUserInfo}> {user?.email} </strong> */}
            <div
              className={`d-flex justify-content-center align-items-center text-sm font-semibold border border-end-0 border-dark px-2 text-decoration-none `}
            >
              <Avatar className={`${styles.viaBgAccent}`} onClick={toggleUserInfo}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className={styles.userDetailCatch}>
                  <UserDetail isOpen={showUserInfo} onClose={toggleUserInfo} />
              </div>
            </div>
          </>
          }
          <div
            className={`${styles.viaIconBlack} ${styles.viaDropdown} d-flex justify-content-center align-items-center text-sm font-semibold border border-dark p-2 text-decoration-none`}
          >
            <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <a className="dropdown-item" href="https://viasocket.com/pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="https://viasocket.com/discovery">
                  Discovery
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="https://viasocket.com/support">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
