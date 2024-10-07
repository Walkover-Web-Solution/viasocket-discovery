import React from 'react';
import styles from './ChatBotComponents.module.scss';
import { List } from '@mui/material';
import BlogCard from '../Blog/Blog';
const Components = {
    urls : (content) => {
        return (
            <div className = {styles.urlsDiv}>
                <p className = {styles.message}>{content.message}</p>
                <List className = {styles.urlsList}>
                    {
                        content.urls.map((link) => (
                            <BlogCard key = {link.id} blog = {link} />
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default Components;