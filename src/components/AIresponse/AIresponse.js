// components/AIresponse/AIresponse.js
import React, { useEffect, useState } from 'react';
import styles from './AIresponse.module.scss';
import Head from 'next/head'
import Components from '../BlogComponents/BlogComponents';
import Link from 'next/link';
import { Box } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import AddIcon from '@mui/icons-material/Add';

const AIresponse = ({ blogData, users, integrations, appBlogs, isOpen, setIsOpen }) => {
  const hasMarkdown = blogData?.blog;
  const [slHeight, setSlHeight] = useState(0);

  let detailedReviews= {};
  let dynamicSections = [];
  let faqSection = [];
  blogData?.blog?.forEach((section)=>{
    if(section?.section === 'detailed_reviews') detailedReviews = section;
    if(section?.section === 'FAQ') 
      faqSection = section ; 
    else 
      dynamicSections.push(section);
  })
  
  function openChatBot(){
    setIsOpen(true);
  }

  useEffect(() => {
    const dr = document.getElementById('detailed-reviews')?.getBoundingClientRect().top;
    const sc = document.getElementById('summary-container')?.getBoundingClientRect().top; // Summary Container should end before detailed reviews
    setSlHeight(dr - sc);
  }, [])
  
  return (
    <>
      <Head>
        <title>{((blogData?.meta?.headerTitle || blogData?.title) || "New chat") + ' | Viasocket'}</title>
      </Head>
      <div className = {styles.blogPage}>
        {Components['title']({users, createdAt: blogData.createdAt, content: blogData.title, subHeading: blogData.titleDescription, updatedAt: blogData.updatedAt })}
        <div className={styles.containerDiv}>
          <div className={styles.markdownContainer}>
            {!hasMarkdown && Components['dummy']()}
            {hasMarkdown && (
              <>
               {dynamicSections.map(({content, heading, section}) => (
                  (section === 'detailed_reviews') ?
                    Components['detailedReviews']({...detailedReviews, integrations, appBlogs, apps : blogData.apps}):
                    Components['additionalSection']?.({content, heading})
                ))}
              </>
            )}
          </div>
          {!isOpen && <div className={styles.floaterDiv}>
            <Box className={styles.summaryContainer} id='summary-container' height={slHeight}>
              {Components['summaryList']({appNames: detailedReviews.content.map(app => app.appName), integrations})}
            </Box>
            <Box className={styles.aiButtonDiv}>
              <div>
                <button onClick={openChatBot} className={styles.contribute}><AddIcon/> Contribute</button>
                <button onClick={openChatBot} className={styles.askMore}><AutoAwesomeOutlinedIcon/> Ask More</button>
              </div>
            </Box>
          </div>}
        </div>
      </div>
    </>
  );
};

export default AIresponse;
