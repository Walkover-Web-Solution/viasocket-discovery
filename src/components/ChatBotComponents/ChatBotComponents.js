import React from 'react';
import styles from './ChatBotComponents.module.scss';
import { List } from '@mui/material';
const Components = {
    urls : (content) => {
        return (
            <div className = {styles.urlsDiv}>
                <p>{content.message}</p>
                <List className = {styles.urlsList}>
                    {
                        content.urls.map((link) => (
                            <li className = {styles.urlsItem} key = {link?.url}>
                                <a target='_blank' href = {link?.url}>{link?.title}</a>
                            </li>
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default Components;