import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '@/components/Blog/Blog.module.scss';
import { Avatar } from '@mui/material';

export default function BlogCard({ blog, isLoading, className }) {

  if (isLoading) {
    return (
      <div className={styles.card}>
        <Skeleton baseColor='transparent' height={0} style={{ "maxWidth":"10.5in" ,"margin":"0px"}} width={`100vw`} />
        <Skeleton height={30} style={{"marginBottom":"15px"}}  />
        {/* <Skeleton height={30} style={{"margin":"6px 0"}} count={3} /> */}
        <div className={styles.appIconsDiv}>
            <Skeleton height={50} width={50}style={{"marginBottom":"6px"} }   />
            <Skeleton height={50} width={50}style={{"marginBottom":"6px"} }   />
            <Skeleton height={50} width={50}style={{"marginBottom":"15px"} }   />
          </div>
          <div className={styles.appIconsDiv}>
            <Skeleton height={30} width={100}style={{"marginBottom":"6px"} } borderRadius={'14px'}   />
            <Skeleton height={30} width={100}style={{"marginBottom":"6px"} }  borderRadius={'14px'}  />
            <Skeleton height={30} width={100}style={{"marginBottom":"6px"} } borderRadius={'14px'}   />
          </div>
      </div>
    );
  }
  return (
    <div key={blog.id} className={`${styles.card} ${className || ''}`}>
      <a href={blog.url || `/discovery/blog/${blog.id}`} target="_blank" rel="noopener noreferrer">
        <h3>{blog.title}</h3>
        {/* <p>{blog.introduction || blog.blog?.find(section => section.section === 'introduction')?.content}</p> */}
        <div className={styles.appIconsDiv}>
          {Object.entries(blog?.apps||{}).map(([appName, {iconUrl}], index) => {
            if(!iconUrl) return null;
            return (<Avatar 
              key={index}
              className={styles.appIcon}
              src={iconUrl}
              alt={appName}
              variant = 'square'
            />
          )})}
        </div>
        <div className={styles.tagsContainer}>
          {blog.tags?.map((tag, index) => (
            <button
              key={index}
              className={`${styles.tag} ${styles[tag.toLowerCase()]}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </a>
    </div>
  );
}
