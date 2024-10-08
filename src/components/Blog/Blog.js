import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '@/components/Blog/Blog.module.css';

export default function BlogCard({ blog, isLoading}) {

  if (isLoading) {
    return (
      <div className={styles.card}>
        <Skeleton baseColor='transparent' height={0} style={{ "maxWidth":"10.5in"}} width={`100vw`} />
        <Skeleton height={30} style={{"marginBottom":"6px"}}  />
        <Skeleton height={30} style={{"margin":"6px 0"}} count={3} />
        <div className={styles.tagsContainer}>
          <Skeleton height={30} width={80} />
        </div>
      </div>
    );
  }

  return (
    <div key={blog.id} className={styles.card}>
      <a href={blog.url || `/discovery/blog/${blog.id}`} target="_blank" rel="noopener noreferrer">
        <h3>{blog.title}</h3>
        <p>{blog.introduction || blog.blog?.find(section => section.section === 'introduction')?.content}</p>
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
