import React from "react";
import { appNameToId } from "@/utils/utils";

const BlogSummary = ({ appNames, integrations, meta }) => {
  return (
    <ul className="blog-page__summary-list list-unstyled d-flex flex-column border bg-white">
      {appNames?.map((app, idx) => {
        const appSlugName = appNameToId(app);
        const appNameLower = app.toLowerCase();
        const appData = integrations?.[appNameLower]?.plugins[appSlugName];
        
        const domain = appData?.domain || `${appSlugName}.com`;
        const iconUrl = appData?.iconurl || `https://logo.clearbit.com/${domain}`;

        return (
          <li key={idx} className="list-unstyled">
            <a 
              href={`#${appSlugName}`} 
              className={`blog-page__summary-item d-flex align-items-center text-decoration-none p-3 text-dark border-bottom`}
            >
              <img 
                src={iconUrl} 
                width="32" 
                height="32" 
                alt={app} 
                className={`blog-page__summary-icon me-2 rounded`}
                loading="lazy" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                }}
              />
              <span className="fw-medium">{app}</span>
            </a>
          </li>
        );
      })}
      <li className={`blog-page__view-all mt-auto`} style={{backgroundColor: '#a8200d'}}>
        <a 
          href={`https://viasocket.com/integrations/category/${meta.categorySlug || 'all'}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="d-flex align-items-center justify-content-between text-decoration-none text-white fw-bold p-3"
        >
          <span>View All from {meta.category}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </li>
    </ul>
  );
};

export default BlogSummary;
