// components/AIresponse/AIresponse.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ChatFooter from '@/components/ChatFooter/ChatFooter';
import styles from './AIresponse.module.scss';
import Head from 'next/head'
import { toast } from 'react-toastify';
import {  publishBlog, updateBlog } from '@/utils/apiHelper';
import Popup from '../PopupModel/PopupModel';
import Components from '../BlogComponents/BlogComponents';
import { compareBlogs } from '@/utils/apis/chatbotapis';
const AIresponse = ({ blogData, oldBlog, isEditable, chatId, user, integrations, setOldBlog }) => {
  const [isPopupOpen, setIsPopUpOpen] = useState(false);
  const router = useRouter()
  const hasMarkdown = blogData?.blog;

  const handlePublish = async () => {
    const blogDataToPublish = {
      ...blogData,
      createdBy: user?.id, 
      published: true,
      apps : blogData.blog.find(section => section.section ==='summaryList').content.map(app => app.name)
    }
    try {
      const res = await compareBlogs(
        {
          variables : {
            current_blog: (oldBlog?.blog),
            updated_blog: (blogData?.blog),
          }
        })
      if (!oldBlog || JSON.parse(res?.content)?.ans === 'yes'){
        await updateBlog(chatId, blogDataToPublish);
        setOldBlog(blogData);
        toast.success('Blog updated successfully!');
      } else {
        setIsPopUpOpen(true);
      }
    } catch (error) {
      console.error('Failed to publish blog:', error);
      toast.error('An error occurred while publishing the blog: ' + error.message);
    }
  };
  const handleNewPublish = async () => {
    const blogDataToPublish = {
      ...blogData,
      createdBy: user?.id,
      published: true
    };
    try {
      const data = await publishBlog(blogDataToPublish);
      setOldBlog(blogData);
      router.push(`/edit/${data.data._id}`);
      toast.success('Blog published successfully!');
    } catch (error) {
      console.error('Failed to publish blog:', error);
      toast.error('An error occurred while publishing the blog: ' + error.message);
    } finally {
      setIsPopUpOpen(false)
    }
  };
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
            <ChatFooter
              onPublish={handlePublish}
              isEditable={isEditable}
            />
          </>
        )}
      </div>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopUpOpen(false)} handlePublish={handleNewPublish} />
    </>
  );
};

export default AIresponse;
