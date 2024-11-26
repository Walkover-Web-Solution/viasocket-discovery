import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '@/components/Blog/Blog.module.scss';
import { Avatar, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { nameToSlugName } from '@/utils/utils';

export default function BlogCard({ blog, isLoading, className }) {
  if (isLoading) {
    return (
      <Box className={styles.card}>
        <Skeleton baseColor='transparent' height={0} style={{ "maxWidth":"10.5in" ,"margin":"0px"}} width={`100vw`} />
        <Skeleton height={30} style={{"marginBottom":"15px"}}  />
        {/* <Skeleton height={30} style={{"margin":"6px 0"}} count={3} /> */}
        <Box className={styles.appIconsDiv}>
            <Skeleton height={50} width={50}style={{"marginBottom":"6px"} }   />
            <Skeleton height={50} width={50}style={{"marginBottom":"6px"} }   />
            <Skeleton height={50} width={50}style={{"marginBottom":"15px"} }   />
          </Box>
          <Box className={styles.appIconsDiv}>
            <Skeleton height={30} width={100}style={{"marginBottom":"6px"} } borderRadius={'14px'}   />
            <Skeleton height={30} width={100}style={{"marginBottom":"6px"} }  borderRadius={'14px'}  />
            <Skeleton height={30} width={100}style={{"marginBottom":"6px"} } borderRadius={'14px'}   />
          </Box>
      </Box>
    );
  }
  return (
    <Box key={blog.id} className={`${styles.card} ${className || ''}`}>
      <a href={blog.url || `/discovery/blog/${blog.id}/${blog?.meta?.category ? `${blog.meta.category}/` : ''}${blog?.slugName ? nameToSlugName(blog.slugName):''}`} target="_blank" rel="noopener noreferrer">
        <Typography variant='h3' sx={{ fontSize: { xs: '1rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem' } }} >{blog.title}</Typography>

        <Box className={styles.appIconsDiv}>
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
        </Box>
      </a>
      <Box className={styles.tagsContainer}>
        {blog.tags?.map((tag, index) => (
          <Link
              key={index}
              href={`/?search=%23${tag}`}
            >
          <Typography variant='h1'  sx={{ fontSize: { xs: '.5rem', sm: '0.7rem', md: '.9rem', lg: '1rem'} }} className={`${styles.tag} ${styles[tag.toLowerCase()]}`}>
                  {tag}    
            </Typography>
            </Link>
        ))}
      </Box>
    </Box>
  );
}
