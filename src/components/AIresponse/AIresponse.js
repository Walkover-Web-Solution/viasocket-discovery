// components/AIresponse/AIresponse.js
import React from 'react';
import styles from './AIresponse.module.scss';
import Head from 'next/head'
import Components from '../BlogComponents/BlogComponents';
const AIresponse = ({ blogData, user, integrations }) => {
  const hasMarkdown = blogData?.blog;
  
  return (
    <>
      <Head>
        <title>{(blogData?.title || "New chat") + ' | Viasocket'}</title>
      </Head>
      <div className={styles.markdownContainer}>
        {!hasMarkdown && Components['dummy']()}
        {hasMarkdown && (
          <>
            {
              blogData.blog.map(({section, content}) => Components[section]?.({content, integrations, user, createdAt: blogData.createdAt}))
            }
            <div className={styles.tagsContainer}>
              <h3>Related Tags:</h3>
              {blogData?.tags?.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AIresponse;
