import { clearUserData } from '@/utils/storageHelper';
import { useUser } from '@/context/UserContext';
import { ClickAwayListener } from '@mui/material';
import Link from "next/link";

const UserDetail = ({ isOpen, onClose }) => {
    const { user, setUser } = useUser();

    const handleLogout = () => {
        clearUserData();
        setUser(null);
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <ClickAwayListener onClickAway={onClose}>
            <ul
                className="dropdown-menu show shadow position-absolute mt-4 me-2"
                style={{ zIndex: 20, minWidth: 180 }}
                role="menu"
                aria-label="User menu"
            >
                <li className="px-3 py-2">
                    {user.name && <div className="fw-semibold text-dark">{user.name}</div>}
                    {user.email && <div className="small text-muted text-break">{user.email}</div>}
                </li>
                <li><hr className="dropdown-divider" /></li>
                {user.id && (
                    <li>
                        <Link href={`/user/${user.id}`} className="dropdown-item" onClick={onClose}>
                            My Automation Ideas
                        </Link>
                    </li>
                )}
                <li>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="dropdown-item text-danger"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </ClickAwayListener>
    );
};

export default UserDetail;
