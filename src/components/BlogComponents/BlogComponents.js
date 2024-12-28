import { appNameToId, dummyMarkdown, nameToSlugName } from '@/utils/utils';
import { Avatar, List, ListItem, styled } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './BlogComponents.module.scss'
import Integrations from '../Integrations/Integrations';
import ContributorsPopup from '../ContributersPopup/ContributersPopup';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ExtensionIcon from '@mui/icons-material/Extension';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import Link from 'next/link';



const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: 'rgba(0, 0, 0)',
      fontSize: theme.typography.pxToRem(14),
      border: '1px solid #dadde9',
      padding: '20px'
    },
  }));

const Components = {
    title: ({content, users, createdAt, subHeading, updatedAt}) => {
        
        
        const isWithinLast7Days = new Date(Math.max(new Date(createdAt), updatedAt ? new Date(updatedAt) : 0)) >= new Date(Date.now() - 7 * 864e5);
        return (
            <div className={styles.titleContainer}>
                <div className={styles.titleDiv + ' glass-effect'}>
                    <div>

                    <h1 className = {`${styles.title} heading`}>
                        {content}
                    </h1>
                    <h3>{subHeading}</h3>
                    </div>
                    <ContributorsPopup users={users} createdAt={createdAt} title={content}/>
                    { isWithinLast7Days && (
                        <div className={styles.underReview}>
                            <HtmlTooltip title="This article is currently under review by our expert team.">
                                <h4><TimelapseIcon/> Under Review</h4>
                            </HtmlTooltip>
                        </div> )
                    }
                </div>
            </div>
    )}, 

    sub_title: ({content}) => (
        <div className = {styles.subTitleContainer}>
            <h2 className = {styles.subTitle}>{content}</h2>
        </div>
    ),
    summaryList : ({appNames, integrations}) => {
        return (
            <div className = {styles.summaryList}>
                <List className={styles.list}>
                    {appNames.map((app, idx) => {
                        const appName = app.toLowerCase();
                        const appSlugName = appNameToId(app);
                        const appData = integrations?.[appName]?.plugins[appSlugName];
                        return (
                            <a className = {styles.appLink} key = {idx} href = {`#${appSlugName}`}>
                                <ListItem  className = {styles.listItem}>
                                    <Avatar className = {styles.appIcon} alt={app} src={appData?.iconurl || 'https://thingsofbrand.com/api/viasocket.com/logos/viasocket_logo'} variant='square'/>
                                    <div className = {styles.content}>
                                        <h5>{app}</h5>
                                    <ReactMarkdown className = {styles.description} remarkPlugins={[remarkGfm]}>
                                            {appData?.description || ""}
                                        </ReactMarkdown>
                                    </div>
                                    <ArrowOutwardIcon className = {styles.arrowIcon} fontSize='small'/>
                                </ListItem>
                            </a>
                        )
                    })}
                </List>
            </div>
        )
    },
    detailedReviews : ({content, integrations, appBlogs, apps }) => {
        return (
            <div className = {styles.detailedReviews} id="detailed-reviews">
                <h4>📖 In Depth Reviews</h4>
                <div className = {styles.howWeAssess}>
                    <p>
                        We independently review every app we recommend We independently review every app we recommend
                        <HtmlTooltip className={styles.tooltip} title = {
                            <React.Fragment>
                                <p className={styles.tooltipText}>At AppDiscovery, our best apps roundups are written by humans who thoroughly review, test, and write about SaaS services and apps. Human insight is involved at every step, from research and testing to writing and editing. Each article then undergoes a 7-day review process to ensure accuracy. We never accept payment for app placements or links—we value the trust our readers place in us for honest, unbiased evaluations. For more details on how we select apps to feature, read the full process – <a style={{color: 'blue', textDecoration: 'underline'}} href='https://viasocket.com/blog/how-we-choose-apps-to-feature-on-app-discovery' target='_blank'>How We Choose Apps to Feature on App Discovery</a></p>
                            </React.Fragment>
                        }>
                            <InfoIcon className={styles.infoIcon}/>
                        </HtmlTooltip>
                    </p>
                    
                </div>
                <List>
                    {content.map(({appName, content}, idx) => (
                        <ListItem className = {styles.listItem} key={idx} id={appNameToId(appName)}>
                            <div className={styles.appTitleDiv}>
                                <a className={styles.appDomain} href={apps[appName]?.domain ? `https://${apps[appName].domain}` : `https://www.google.com/search?q=${appName}`} target='_blank'>
                                    <div className={styles.appHeadingDiv}>
                                        <Avatar className = {styles.appIcon} alt={appName} src={integrations?.[appName.toLowerCase()]?.plugins[nameToSlugName(appName)]?.iconurl} variant='square'>
                                            <ExtensionIcon/>
                                        </Avatar>
                                        <h5>{appName}</h5>
                                    </div>
                                </a>
                                {
                                    integrations?.[appName.toLowerCase()] &&
                                    <Link className={styles.visitIntegrations} href = {`https://viasocket.com/integrations/${nameToSlugName(appName)}`} target='_blank'>
                                        View Integrations <ArrowOutwardIcon fontSize='small'/>
                                    </Link>
                                }   
                            </div>
                            <ReactMarkdown className = {styles.content} remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                            <Integrations integrations = {integrations?.[appName.toLowerCase()]} appslugname = {nameToSlugName(appName)}/>
                            {appBlogs[appName]?.length > 0 && <div className={styles.relatedBlogsDiv}>
                                {appBlogs[appName]?.length>0 && <h6> Explore More on <strong>{appName}</strong></h6>}
                                <ul>
                                {appBlogs[appName]?.map((blog) => {
                                    return <li key={blog.id}><a className={styles.relatedBlogsLink} href={`/discovery/blog/${blog.id}/${blog?.meta?.category ? `${blog.meta.category}/` : ''}${nameToSlugName(blog.slugName)}`} target='_blank'>{blog.title}</a></li>
                                })}
                                </ul>
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
        <div className = {styles.additionalSection}>
            <h4>{heading}</h4>
            <ReactMarkdown className = {styles.content} remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default Components;