import React, { useRef, useState, useEffect } from 'react';
import styles from './Search.module.scss';
import { useUser } from '@/context/UserContext';
import { IconButton, Input, InputAdornment, TextField } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import UserBioPopup from '../UserBioPopup/UserBioPoup';
import UnauthorizedPopup from '../UnauthorisedPopup/UnauthorisedPopup';
import { dispatchAskAiEvent } from '@/utils/utils';
import { setInLocalStorage } from '@/utils/storageHelper';

export default function Search({ searchQuery, setSearchQuery, handleAskAi, placeholder, className, messages, disableEnter }) {
	const { user } = useUser();
	const [unAuthPopup, setUnAuthPopup] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userBioPopup, setUserBioPopup] = useState(false);
	const inputRef = useRef(null);
	
	useEffect(() => {
		if(user?.meta?.bio && userBioPopup){
			setUserBioPopup(false);
		}
	}, [user])
	useEffect(()=>{
		if(messages && messages[messages.length - 1]?.role === 'user'){
			setIsLoading(true);
		}else{
			setIsLoading(false)
		}
	},[messages])

	useEffect(() => {
		const handleEvent = async (e) => {
			if (!user) {
				setUnAuthPopup(true);
				return;
			}
			if(!user.meta?.bio){
				setUserBioPopup(true);
				return;
			}
			setSearchQuery('');
			dispatchAskAiEvent(e.detail);
		}
		window.addEventListener('askAppAiWithAuth', handleEvent);
		return () => {
			window.removeEventListener('askAppAiWithAuth', handleEvent);
		}
	});

	const handleClick = () => {
		if(isLoading) return;
		if (!user) {
			setInLocalStorage('query',searchQuery)
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
						if (e.key === 'Enter' && !disableEnter) {
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
			<UserBioPopup isOpen={userBioPopup} onClose={()=>setUserBioPopup(false)}/>
		</>
	)
} 