import React, { useState } from 'react';
import styles from './Search.module.scss';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import UnauthorizedPopup from '../UnauthorisedPopup/UnauthorisedPopup';


export default function Search({ handleCreateChat, searchQuery, setSearchQuery, handleAskAi, placeholder }) {
	const { user } = useUser();
	const [isOpen, setIsOpen] = useState(false);

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
	return (
		<>
			<div className={styles.postHeader}>
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
				/>
				<button className={styles.newChat} onClick={handleClick}>Ask AI</button>
			</div>
			<UnauthorizedPopup isOpen={isOpen} onClose={onClose} />
		</>
	)
} 