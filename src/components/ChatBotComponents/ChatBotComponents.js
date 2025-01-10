import React from 'react';
import styles from './ChatBotComponents.module.scss';
import { List } from '@mui/material';
import BlogCard from '../Blog/Blog';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Components = {
    urls : (content) => {
        return (
            <div className = {styles.urlsDiv}>
                <p className = {styles.message}>{content.message}</p>
                <List className = {styles.urlsList}>
                    {
                        content.urls.map((link) => (
                            <BlogCard className = {styles.blogInChats} key = {link.id} blog = {link} />
                        ))
                    }
                </List>
            </div>
        )
    }, 
    
    botMessage: (message) => {
        return (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
            </ReactMarkdown>
        )
    }
}

export default Components;