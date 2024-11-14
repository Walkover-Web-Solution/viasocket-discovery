import React, { useRef, useState, useEffect } from 'react';
import styles from './Search.module.scss';
import { useUser } from '@/context/UserContext';
import UnauthorizedPopup from '../UnauthorisedPopup/UnauthorisedPopup';
import { IconButton, Input, InputAdornment, TextField } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import UserBioPopup from '../UserBioPopup/UserBioPoup';

export default function Search({ searchQuery, setSearchQuery, handleAskAi, placeholder, className }) {
	const { user } = useUser();
	const [unAuthPopup, setUnAuthPopup] = useState(false);
	const [userBioPopup, setUserBioPopup] = useState(false);
	const inputRef = useRef(null);

	const handleClick = () => {
		if (!user) {
			setUnAuthPopup(true);
			return;
		}
		if(!user.meta?.bio){
			setUserBioPopup(true);
            return;
		}
		setSearchQuery("")
		handleAskAi();
	}

	const onUnAuthClose = () => {
		setUnAuthPopup(false);
	}

	useEffect(() => {
		if(user?.meta?.bio && userBioPopup){
			setUserBioPopup(false);
		}
	}, [user])

	useEffect(() => {
        inputRef.current.focus();
    }, []);

	return (
		<>
			<div className={`${styles.postHeader} ${className}`}>
				<input
					type="text"
					className={styles.search}
					placeholder={placeholder || "Ask AI..."}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleClick()
						}
					}}
					ref = {inputRef}
				/>
				<IconButton
					onClick={handleClick}
					edge="end"
					size='large'
					className = {styles.askAi}
				>
					<AutoAwesomeOutlinedIcon fontSize = 'large' sx={{color: 'black'}}/>
				</IconButton>
			</div>
			<UnauthorizedPopup isOpen={unAuthPopup} onClose={onUnAuthClose} />
			<UserBioPopup isOpen={userBioPopup} onClose={()=>setUserBioPopup(false)} onSave={handleClick}/>
		</>
	)
} 