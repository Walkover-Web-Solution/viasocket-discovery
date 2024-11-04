// components/AIresponse/AIresponse.js
import React from 'react';
import styles from './AIresponse.module.scss';
import Head from 'next/head'
import Components from '../BlogComponents/BlogComponents';
import Link from 'next/link';
const AIresponse = ({ blogData, users, integrations }) => {
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
              blogData.blog.map(({section, content, heading}) => Components[section]?.({content, integrations, users, createdAt: blogData.createdAt, heading}))
            }
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
    </>
  );
};

export default AIresponse;
