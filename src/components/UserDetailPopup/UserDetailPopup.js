import { useEffect, useRef } from 'react';
import styles from "@/components/UserDetailPopup/UserDetailPopup.module.css";
import { clearUserData } from '@/utils/storageHelper';
import { useUser } from '@/context/UserContext';

const UserDetail = ({ isOpen, onClose }) => {
    const {user , setUser}=useUser();
    const popupRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleLogout = async () => {

        clearUserData();
        setUser(null);
        onClose();

    };

    if (!isOpen) return null;

    return (
        <>
            <div ref={popupRef} className={styles.popupContainer}>
                <div className={styles.userDetails}>
                        <>
                            <p><b>{user?.name}</b></p>
                            <p><b>{user?.email}</b></p>
                            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                        </>
                </div>
            </div>
        </>
    );
};

export default UserDetail;
