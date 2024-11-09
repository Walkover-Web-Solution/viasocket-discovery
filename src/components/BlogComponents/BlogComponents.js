import { dummyMarkdown, nameToSlugName } from '@/utils/utils';
import { Avatar, List, ListItem } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './BlogComponents.module.scss'
import Integrations from '../Integrations/Integrations';
import ContributorsPopup from '../ContributersPopup/ContributersPopup';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { getCurrentEnvironment } from '@/utils/storageHelper';

const Components = {
    title: ({content, users, createdAt}) => (
        <div className={styles.titleDiv}>
            <h1 className = {styles.title}>
                {content}
            </h1>
            <ContributorsPopup users={users} createdAt={createdAt} title={content}/>
        </div>
    ), 
    introduction : ({content}) => (
        <ReactMarkdown className = {styles.introduction} remarkPlugins={[remarkGfm]}>
        {content}
        </ReactMarkdown>
    ),
    summaryList : ({content, integrations}) => {
        return (
            <div className = {styles.summaryList}>
                <h4>Top Apps</h4>
                <List className={styles.list}>
                    {content.map((app, idx) => {
                        const appName = app.name.toLowerCase();
                        const appSlugName = nameToSlugName(app.name);
                        const appData = integrations?.[appName]?.plugins[appSlugName];
                        return (
                            <a className = {styles.appLink} key = {idx} href = {appData ? `https://viasocket.com/integrations/${appSlugName}` : null} target='_blank'>
                                <ListItem  className = {styles.listItem}>
                                    <Avatar className = {styles.appIcon} alt={app.name} src={appData?.iconurl || 'https://thingsofbrand.com/api/viasocket.com/logos/viasocket_logo_1'} variant='square'/>
                                    <div className = {styles.content}>
                                        <h5>{app.name}</h5>
                                        <ReactMarkdown className = {styles.description} remarkPlugins={[remarkGfm]}>
                                            {appData?.description || app.description}
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
    whatToLookFor: ({content}) => (
        <div className = {styles.whatToLookFor}>
            <h4>What To Look For</h4>
            <ReactMarkdown className = {styles.content} remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    ), 
    detailedReviews : ({content, integrations, appBlogs}) => {
        const apps = content.map(app => app.name);
        return (
            <div className = {styles.detailedReviews}>
                <h4>Detailed Reviews</h4>
                <List>
                    {content.map((app, idx) => (
                        <ListItem className = {styles.listItem} key = {idx}>
                            <h5>{app.name}</h5>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {app.content}
                            </ReactMarkdown>
                            <Integrations integrations = {integrations?.[app.name.toLowerCase()]} appslugname = {nameToSlugName(app.name)}/>
                            {appBlogs[app.name].length>0 && <h6> Explore More on {app.name} </h6>}
                            <div className={styles.relatedBlogsDiv}>
                                    {appBlogs[app.name].map((blog) => {
                                        return <a key={blog.id} className={styles.relatedBlogsLink} href={`${getCurrentEnvironment()==='prod' ? 'https://viasocket.com' :''}/discovery/blog/${blog.id}`} target='_black'>{blog.title}</a>
                                    })}
                                </div>
                        </ListItem>
                    ))}
                </List>
            </div>
        )
    },
    conclusion: ({content}) => (
        <div className = {styles.conclusion}>
            <h4>Conclusion</h4>
            <ReactMarkdown className = {styles.content} remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    ), 
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