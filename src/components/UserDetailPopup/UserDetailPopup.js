import styles from "@/components/UserDetailPopup/UserDetailPopup.module.css";
import { clearUserData } from '@/utils/storageHelper';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import { ClickAwayListener } from '@mui/material';
import Link from "next/link";

const UserDetail = ({ isOpen, onClose }) => {
    const {user , setUser}=useUser();
    const router= useRouter();


    const handleMouseLeave = () => {
        onClose();
    };
    const handleLogout = async () => {
        clearUserData();
        setUser(null);
        onClose();
        // router.reload();
    };

    if (!isOpen) return null;

    return (
        <>
            <ClickAwayListener onClickAway={handleMouseLeave}>
                <div  className={styles.popupContainer}>
                    <div className={styles.userDetails}>
                            <>
                                <p><b>{user?.name || ""}</b></p>
                                <p><b>{user?.email || ""}</b></p>
                                {/* <div className={styles.buttonContainer}> */}
                                    <Link className={styles.blogsLink} href={`/user/${user.id}`}><b>My Discoveries</b></Link>
                                    <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                                {/* </div> */}
                            </>
                    </div>
                </div>
            </ClickAwayListener>
        </>
    );
};

export default UserDetail;
