import React, { useState } from 'react';
import styles from './Search.module.scss';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';


export default function Search({ handleCreateChat, searchQuery, setSearchQuery, handleAskAi }) {
    const { user } = useUser();
    const handleClick = () => {
        if (!user) {
            window.location.href = "discovery/auth";
            toast.error("login to perform this action")
            return;
        }
        handleAskAi();
    }
    return (<div className={styles.postHeader}>
        <input
            type="text"
            className={styles.search}
            placeholder="Search Categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleClick()
                }
            }}
        />
        <button className={styles.newChat} onClick={handleClick}>Ask AI</button>
    </div>)
} 