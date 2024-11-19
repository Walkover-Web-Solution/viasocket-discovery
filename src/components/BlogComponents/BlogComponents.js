import { dummyMarkdown, nameToSlugName } from '@/utils/utils';
import { Avatar, List, ListItem } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './BlogComponents.module.scss'
import Integrations from '../Integrations/Integrations';
import ContributorsPopup from '../ContributersPopup/ContributersPopup';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const Components = {
    title: ({content, users, createdAt}) => (
        <div className={styles.titleDiv}>
            <h1 className = {styles.title}>
                {content}
            </h1>
            <ContributorsPopup users={users} createdAt={createdAt} title={content}/>
        </div>
    ), 
    summaryList : ({appNames, integrations}) => {
        return (
            <div className = {styles.summaryList}>
                <List className={styles.list}>
                    {appNames.map((app, idx) => {
                        const appName = app.toLowerCase();
                        const appSlugName = nameToSlugName(app);
                        const appData = integrations?.[appName]?.plugins[appSlugName];
                        return (
                            <a className = {styles.appLink} key = {idx} href = {appData ? `https://viasocket.com/integrations/${appSlugName}` : null} target='_blank'>
                                <ListItem  className = {styles.listItem}>
                                    <Avatar className = {styles.appIcon} alt={app} src={appData?.iconurl || 'https://thingsofbrand.com/api/viasocket.com/logos/viasocket_logo_1'} variant='square'/>
                                    <div className = {styles.content}>
                                        <h5>{app}</h5>
                                        <ReactMarkdown className = {styles.description} remarkPlugins={[remarkGfm]}>
                                            {appData?.description || ""}
                                        </ReactMarkdown>
                                    </div>
                                    <ArrowOutwardIcon className = {styles.arrowIcon} fontSize='medium'/>
                                </ListItem>
                            </a>
                        )
                    })}
                </List>
            </div>
        )
    },
    detailedReviews : ({content, integrations, appBlogs}) => {
        return (
            <div className = {styles.detailedReviews}>
                <h4>Detailed Reviews</h4>
                <List>
                    {content.map(({appName, content}, idx) => (
                        <ListItem className = {styles.listItem} key = {idx}>
                            <h5>{appName}</h5>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                            <Integrations integrations = {integrations?.[appName.toLowerCase()]} appslugname = {nameToSlugName(appName)}/>
                            <div className={styles.relatedBlogsDiv}>
                                {appBlogs[appName]?.length>0 && <h6> Explore More on <strong>{appName}</strong></h6>}
                                {appBlogs[appName]?.map((blog) => {
                                    return <a key={blog.id} className={styles.relatedBlogsLink} href={`/discovery/blog/${blog.id}/${blog?.meta?.category ? `${blog.meta.category}/` : ''}${nameToSlugName(blog.slugName)}`} target='_blank'>{blog.title}</a>
                                })}
                            </div>
                        </ListItem>
                    ))}
                </List>
            </div>
        )
    },
    dummy : () => (
        <ReactMarkdown className = {styles.dummyMarkdown} remarkPlugins={[remarkGfm]}>
            {dummyMarkdown}
        </ReactMarkdown>
    ),
    additionalSection: ({content, heading}) => (
        <div className = {styles.conclusion}>
            <h4>{heading}</h4>
            <ReactMarkdown className = {styles.content} remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default Components;