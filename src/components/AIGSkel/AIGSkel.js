import React from 'react';
import styles from './AIGSkel.module.scss';

const AIGSkel = () => {
  return (
    <div className={styles['aig-skel']}>
      <div className={`${styles['aig-skel__line']} ${styles['aig-skel__line--title']}`}></div>
      <div className={`${styles['aig-skel__line']} ${styles['aig-skel__line--desc']}`}></div>
      <div className={`${styles['aig-skel__line']} ${styles['aig-skel__line--desc-short']}`}></div>
      <div className={styles['aig-skel__chain']}>
        <div className={`${styles['aig-skel__pill']} ${styles['aig-skel__pill--1']}`}></div>
        <div className={styles['aig-skel__arrow']}>→</div>
        <div className={`${styles['aig-skel__pill']} ${styles['aig-skel__pill--2']}`}></div>
        <div className={styles['aig-skel__arrow']}>→</div>
        <div className={`${styles['aig-skel__pill']} ${styles['aig-skel__pill--3']}`}></div>
      </div>
      <div className={`${styles['aig-skel__line']} ${styles['aig-skel__line--cta']}`}></div>
    </div>
  );
};

export default AIGSkel;
