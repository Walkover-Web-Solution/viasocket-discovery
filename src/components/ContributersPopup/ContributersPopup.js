import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import styles from '@/components/ContributersPopup/ContributersPopup.module.css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ContributorsPopup = ({ users, createdAt }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleMouseEnter = (e) => {
        setShowPopup(true);
    };

    const handleMouseLeave = () => {
        setShowPopup(false);
    };

    return (
        <div className={styles.contributorsContainer}>
            {(!showPopup || users.length === 1) &&
                <div className={styles.userAVA}  onMouseEnter={handleMouseEnter}>
                    {users.slice(0, 3).map((user) => (
                    <Avatar key={user.id} alt={user.name} className={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                ))}
                    {users.length > 1 ? (
                        <span className={styles.contributorsText}>
                            {users.length > 3 ? `+ ${users.length - 3}` : ''} Contributors
                        </span>
                    ) : (
                        <span className={styles.userName}><strong>{users[0]?.name}</strong></span>
                    )}
                </div>
            }
            {showPopup && users.length > 1 && (
                <div className={styles.popup} onMouseLeave={handleMouseLeave}>
                    {users.map((user) => (
                        <div key={user.id} className={styles.popupItem}>
                            <Avatar key={user.id} alt={user.name} className={styles.avatarPopup}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <span>{user.name}</span>
                        </div>
                    ))}
                </div>
             )}      
             {createdAt && (
            <>
                <FiberManualRecordIcon className={styles.dot} />
                <span>{new Date(createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                })}</span>
            </>
        )}       
        </div>
    );
};

export default ContributorsPopup;
