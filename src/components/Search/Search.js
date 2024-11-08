import React, { useRef, useState, useEffect } from 'react';
import styles from './Search.module.scss';
import { useUser } from '@/context/UserContext';
import UnauthorizedPopup from '../UnauthorisedPopup/UnauthorisedPopup';
import { IconButton, Input, InputAdornment, TextField } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

export default function Search({ handleCreateChat, searchQuery, setSearchQuery, handleAskAi, placeholder, className }) {
	const { user } = useUser();
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef(null);

	const handleClick = () => {
		if (!user) {
			setIsOpen(true);
			return;
		}
		setSearchQuery("")
		handleAskAi();
	}

	const onClose = () => {
		setIsOpen(false);
	}

	useEffect(() => {
        // Focus the input element when the component mounts
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
			<UnauthorizedPopup isOpen={isOpen} onClose={onClose} />
		</>
	)
} 