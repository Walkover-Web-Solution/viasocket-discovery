import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { Avatar } from '@mui/material';
import styles from '@/components/ContributersPopup/ContributersPopup.module.css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const ContributorsPopup = ({ users, createdAt }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const router = useRouter(); 

    useEffect(() => {
        const url = window.location.href;
        setCurrentUrl(url);
    }, [router.asPath]);

    const generateShareText = () => {
        if (users.length === 1) {
            return `Check out Apps by ${users[0].name}!`;
        } else if (users.length > 1) {
            const contributorNames = users.slice(0, 2).map(user => user.name).join(', ');
            const remainingContributors = users.length - 2;
            const othersText = remainingContributors > 0 ? ` and ${remainingContributors} others` : '';
            return `Check out Apps by ${contributorNames}${othersText}!`;
        }
        return "Check out this Apps!";
    };

    const shareText = generateShareText();

    const handleMouseEnter = (e) => {
        setShowPopup(true);
    };

    const handleMouseLeave = () => {
        setShowPopup(false);
    };

    const handleUserClick = (userId) => {
        router.push(`/user/${userId}`); 
    };

    const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    const linkedInShare = `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}! ${encodeURIComponent(currentUrl)} %23viasocket`
    ;

    return (
      <div className={styles.shareConatainer}>
        <div className={styles.contributorsContainer}>
            {(!showPopup || users.length === 1) &&
                <div className={styles.userAVA} onMouseEnter={handleMouseEnter}>
                    {users.slice(0, 3).map((user) => (
                        <Avatar 
                            key={user.id} 
                            alt={user.name} 
                            className={styles.avatar}
                            onClick={() => handleUserClick(user.id)} 
                            style={{ cursor: 'pointer' }} 
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                    ))}
                    {users.length > 1 ? (
                        <span className={styles.contributorsText}>
                            {users.length > 3 ? `+ ${users.length - 3}` : ''} Contributors
                        </span>
                    ) : (
                        <span 
                            className={styles.userName} 
                            onClick={() => handleUserClick(users[0].id)} 
                            style={{ cursor: 'pointer' }} 
                        >
                            <strong>{users[0]?.name}</strong>
                        </span>
                    )}
                </div>
            }
            {showPopup && users.length > 1 && (
                <div className={styles.popup} onMouseLeave={handleMouseLeave}>
                    {users.map((user) => (
                        <div 
                            key={user.id} 
                            className={styles.popupItem}
                            onClick={() => handleUserClick(user.id)} 
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
            <div className={styles.shareOptions}>
                <a href={twitterShare} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                    <TwitterIcon className={styles.icon} />
                </a>
                <a href={facebookShare} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                    <FacebookIcon className={styles.icon} />
                </a>
                <a href={linkedInShare} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                    <LinkedInIcon className={styles.icon} />
                </a>
            </div>
           
      </div>
    );
};

export default ContributorsPopup;
