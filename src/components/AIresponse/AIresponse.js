// components/AIresponse/AIresponse.js
import React, { useEffect, useState } from 'react';
import styles from './AIresponse.module.scss';
import Head from 'next/head'
import Components from '../BlogComponents/BlogComponents';
import Link from 'next/link';
import { Box } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import AddIcon from '@mui/icons-material/Add';
import { dispatchAskAppAiWithAuth, restoreDotsInKeys } from '@/utils/utils';
import AddCommentPopup from '../AddCommentPopup/AddCommentPopup';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const AIresponse = ({ blogData, users, integrations, appBlogs, isOpen, setIsOpen, setComments }) => {
  const hasMarkdown = blogData?.blog;
  const [slHeight, setSlHeight] = useState(0);
  const [commentPopup, setCommentPopup] = useState(false);


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
    dispatchAskAppAiWithAuth(null, ()=>{
      setIsOpen(true);
    });
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
      <div className = {`${styles.blogPage} ${isOpen?styles.addLeftMargin:''}`}>
        {Components['title']({users, createdAt: blogData?.createdAt, content: blogData?.title, subHeading: blogData?.titleDescription, updatedAt: blogData?.updatedAt, isUndereview: blogData?.toImprove })}
        <div className={styles.containerDiv}>
          <div className={`${styles.markdownContainer} ${isOpen ? styles.makeFullWidth: ''}`}>
            {!hasMarkdown && Components['dummy']()}
            {hasMarkdown && (
              <>
               {dynamicSections.map(({content, heading, section}) => (
                  (section === 'detailed_reviews') ?
                    Components['detailedReviews']({...detailedReviews, integrations, appBlogs, apps : restoreDotsInKeys(blogData.apps)}):
                    Components['additionalSection']?.({content, heading})
                ))}
              </>
            )}
          </div>
          {!isOpen && <div className={styles.floaterDiv}>
            <Box className={styles.summaryContainer} id='summary-container' height={slHeight}>
              {Components['summaryList']({appNames: detailedReviews.content.map(app => app.appName), integrations, meta: blogData.meta})}
            </Box>
            <Box className={styles.aiButtonDiv}>
              <div>
                <button onClick={() => setCommentPopup(true)} className={styles.contribute}><ChatBubbleIcon/> Contribute</button>
                <button onClick={openChatBot} className={styles.askMore}><AutoAwesomeOutlinedIcon/> Ask More</button>
              </div>
            </Box>
          </div>}
        </div>
      </div>
      <AddCommentPopup open = {commentPopup} onClose = {() => setCommentPopup(false)} setComments = {setComments} blogId = {blogData?.id} />
    </>
  );
};

export default AIresponse;
