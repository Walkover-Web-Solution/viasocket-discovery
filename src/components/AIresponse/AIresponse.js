// components/AIresponse/AIresponse.js
import React from 'react';
import styles from './AIresponse.module.scss';
import Head from 'next/head'
import Components from '../BlogComponents/BlogComponents';
import Link from 'next/link';
const AIresponse = ({ blogData, users, integrations, appBlogs }) => {
  const hasMarkdown = blogData?.blog;
  const [tablecomponent,detailedReviews, ...dynamicSections] = blogData?.blog;
  return (
    <>
      <Head>
        <title>{(blogData?.title || "New chat") + ' | Viasocket'}</title>
      </Head>
      <div className = {styles.blogPage}>
        {Components['title']({users, createdAt: blogData.createdAt, content: blogData.title})}
        <div className={styles.containerDiv}>
          <div className={styles.markdownContainer}>
            {!hasMarkdown && Components['dummy']()}
            {hasMarkdown && (
              <>
                {Components['summaryList']({appNames: detailedReviews.content.map(app => app.appName), integrations})}
                {Components['additionalSection']?.({content : tablecomponent.content,heading: tablecomponent.heading})}
                {Components['detailedReviews']({...detailedReviews, integrations, appBlogs})}
                {dynamicSections.map(({content, heading}) => Components['additionalSection']?.({content, heading}))}
                <div className={styles.tagsContainer}>
                  <h3>Related Tags</h3>
                  {blogData?.tags?.map((tag, index) => (
                    <Link
                    href={`/?search=%23${tag}`}
                    target='_blank'
                    key={index}
                    className={styles.tag}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIresponse;
