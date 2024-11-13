import React, { useState } from 'react';
import { useRouter } from 'next/router'; 
import { Avatar } from '@mui/material';
import styles from '@/components/ContributersPopup/ContributersPopup.module.css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { nameToSlugName } from '@/utils/utils';

const ContributorsPopup = ({ users, createdAt, title }) => {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter(); 
    const currentUrl = 'http://viasocket.com/discovery'+ router.asPath ; 

    const handleMouseEnter = (e) => {
        setShowPopup(true);
    };

    const handleMouseLeave = () => {
        setShowPopup(false);
    };


    const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    const linkedInShare = `https://www.linkedin.com/feed/?shareActive=true&text=${title}! ${encodeURIComponent(currentUrl)} %23viasocket`
    ;

    return (
      <div className={styles.shareConatainer}>
        <div className={styles.contributorsContainer}>
            {(!showPopup || users.length === 1) &&
                <div className={styles.userAVA} onMouseEnter={handleMouseEnter}>
                    {users.length > 0 && users.slice(0, 3).map((user) => (
                        <Avatar 
                            key={user.id} 
                            alt={user.name} 
                            className={styles.avatar}
                        >
                            <a href={`/discovery/user/${user.id}/${nameToSlugName(user.name)}`} target='_blank'>
                                {user.name.charAt(0).toUpperCase()}
                            </a>
                        </Avatar>
                    ))}
                    {users.length > 1 ? (
                        <span className={styles.contributorsText}>
                            {users.length > 3 ? `+ ${users.length - 3}` : ''} Contributors
                        </span>
                    ) : users.length === 1 && (
                        <a href={`/discovery/user/${users[0].id}/${nameToSlugName(users[0].name)}`} target='_blank'>
                        <span className={styles.userName} >
                            <strong>{users[0]?.name}</strong>
                        </span>
                    </a>
                    )}
                </div>
            }
            {showPopup && users.length > 1 && (
                <div className={styles.popup} onMouseLeave={handleMouseLeave}>
                    {users.map((user) => (
                        <a
                            target='_blank'
                            key={user.id} 
                            className={styles.popupItem}
                            href={`/discovery/user/${user.id}/${nameToSlugName(user.name)}`}
                            style={{ cursor: 'pointer' }} 
                        >
                            <Avatar 
                                key={user.id} 
                                alt={user.name} 
                                className={styles.avatarPopup}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <span>{user.name}</span>
                        </a>
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
            <div className={styles.shareOptions}>
                <a href={linkedInShare} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                    <LinkedInIcon className={styles.icon} />
                </a>
                <a href={facebookShare} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                    <FacebookIcon className={styles.icon} />
                </a>
                <a href={twitterShare} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                    <XIcon className={styles.icon} />
                </a>
            </div>
           
      </div>
    );
};

export default ContributorsPopup;
