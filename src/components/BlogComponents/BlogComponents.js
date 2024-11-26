import { dummyMarkdown, nameToSlugName } from '@/utils/utils';
import { Avatar, Box, List, ListItem, Typography } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './BlogComponents.module.scss'
import Integrations from '../Integrations/Integrations';
import ContributorsPopup from '../ContributersPopup/ContributersPopup';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const Components = {
    title: ({content, users, createdAt}) => (
        <div className={styles.titleContainer}>
            <div className={styles.titleDiv}>
                <Typography variant='h1'  sx={{fontSize: { xs: '1.5rem', sm: '2.2rem', md: '3rem', lg: '4rem' },left: { xs: '0'}}} className={`${styles.title} heading`}>{content}</Typography>
                <ContributorsPopup users={users} createdAt={createdAt} title={content}/>
            </div>
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
                <div className = {styles.howWeAssess}>
                    <h6>How We Assess and Test Apps for You</h6>
                    <p>At AppDiscovery, our best apps roundups are written by humans who thoroughly review, test, and write about SaaS services and apps. Human insight is involved at every step, from research and testing to writing and editing. Each article then undergoes a 7-day review process to ensure accuracy. We never accept payment for app placements or links—we value the trust our readers place in us for honest, unbiased evaluations. For more details on how we select apps to feature, read the full process – <a href='https://viasocket.com/blog/how-we-choose-apps-to-feature-on-app-discovery' target='_blank'>How We Choose Apps to Feature on App Discovery</a></p>
                </div>
                <List>
                    {content.map(({appName, content}, idx) => (
                        <ListItem className = {styles.listItem} key = {idx}>
                            <div className={styles.appHeadingDiv}>
                                <Avatar className = {styles.appIcon} alt={appName} src={integrations?.[appName.toLowerCase()]?.plugins[nameToSlugName(appName)]?.iconurl} variant='square'/>
                                <h5>{appName}</h5>
                            </div>
                            <ReactMarkdown className = {styles.content} remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                            <Integrations integrations = {integrations?.[appName.toLowerCase()]} appslugname = {nameToSlugName(appName)}/>
                            {appBlogs[appName]?.length > 0 && <div className={styles.relatedBlogsDiv}>
                                {appBlogs[appName]?.length>0 && <h6> Explore More on <strong>{appName}</strong></h6>}
                                {appBlogs[appName]?.map((blog) => {
                                    return <a key={blog.id} className={styles.relatedBlogsLink} href={`/discovery/blog/${blog.id}/${blog?.meta?.category ? `${blog.meta.category}/` : ''}${nameToSlugName(blog.slugName)}`} target='_blank'>{blog.title}</a>
                                })}
                            </div>}
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
        <Box className = {styles.additionalSection}>
            <Typography variant='h4'  sx={{fontSize: { xs: '2rem', sm: '2.5rem', md: '2.7rem', lg: '3rem' },}}>{heading}</Typography>
            <ReactMarkdown className = {styles.content} remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </Box>
    )
}

export default Components;