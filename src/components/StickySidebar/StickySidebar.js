import React, { useState, useEffect } from 'react';
import styles from './StickySidebar.module.scss';

const StickySidebar = ({ sections, activeIdea }) => {

  return (
    <div className={`${styles.sidebar} position-sticky`}>
      <h4 className="text-muted fw-semibold mb-3 fs-6">IDEAS ON THIS PAGE</h4>
      {sections.map(section => (
        <div key={section.title} className="mb-4">
                    <h6 className="fw-semibold text-brand mb-3">{section.title}</h6>
          <ul className="nav flex-column">
            {section.ideas.map(idea => (
                            <li key={idea.id} className={`nav-item ${styles.ideaItem} ${activeIdea === idea.id ? styles.active : ''}`}>
                <a href={`#${idea.id}`} className="nav-link p-0 d-flex">
                  <span className={styles.ideaNumber}>{idea.text.split('.')[0]}.</span>
                  <span className={styles.ideaText}>{idea.text.split('.').slice(1).join('.')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default StickySidebar;