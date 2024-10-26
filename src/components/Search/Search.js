import React, { useRef, useState, useEffect } from 'react';
import styles from './Search.module.scss';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import UnauthorizedPopup from '../UnauthorisedPopup/UnauthorisedPopup';


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
				<button className={styles.newChat} onClick={handleClick}>Ask AI</button>
			</div>
			<UnauthorizedPopup isOpen={isOpen} onClose={onClose} />
		</>
	)
} 