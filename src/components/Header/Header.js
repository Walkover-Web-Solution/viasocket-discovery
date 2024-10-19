// import  useUser  from "@/context/UserContext";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import UserDetail from "../UserDetailPopup/UserDetailPopup";

export default function Header() {
  const { user } = useUser();

  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(user ? true : false);
  }, [user]);

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };
  return (
    <div
    class="container d-flex align-items-center justify-content-between py-5"
    >
    <img src="https://viasocket.com/assets/brand/logo.svg" alt="Logo" />
    <div class="d-flex align-items-center gap-4">
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
                    <strong class="text-dark" style = {{cursor: "pointer"}} onClick = {toggleUserInfo}> {user.email} </strong>
                    <UserDetail isOpen={showUserInfo} onClose={toggleUserInfo} />
                </>
            ) : (
                <div class="d-flex align-items-center gap-4">
                    <a href="https://viasocket.com/login">
                        <button class="btn btn-outline-dark">Login</button>
                    </a>
                    <a href="https://viasocket.com/signup">
                        <button class="btn btn-dark text-white">Sign Up</button>
                    </a>
                </div>
            )}
        </div>
    </div>
    </div>
  )
}
