import React, { useState } from 'react';
import styles from './Search.module.scss';

export default function Search({ handleCreateChat, searchQuery, setSearchQuery, handleAskAi }) {
    return (<div className={styles.postHeader}>
        <input
            type="text"
            className={styles.search}
            placeholder="Search Categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleAskAi();
                }
            }}
        />
        <button className={styles.newChat} onClick={handleCreateChat}>Ask AI</button>
    </div>)
} 