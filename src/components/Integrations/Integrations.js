// components/AIresponse/AIresponse.js
import { List, Avatar, Link } from '@mui/material';
import React from 'react';
import styles from './Integerations.module.scss';

const Integrations = ({ integrations, appslugname }) => {
  if (!integrations?.combinations?.length) return null;  
  return (
    <div className={styles.integrationDiv}>
        <h3 className = {styles.integrationHeading}>Top Integrations </h3>
        <List className = {styles.integrationList}>
            {integrations?.combinations?.slice(0, 5).map((integration, index) => (
                <li key={index} className = {styles.integrationItem}>
                  <div className = {styles.integrationIcons}>
                    <Avatar alt={integration.trigger.name} src={integrations.plugins[integration.trigger.name].iconurl || ''} variant = 'square'/>
                    <Avatar alt={integration.actions[0].name} src={integrations.plugins[integration.actions[0].name].iconurl || ''} variant = 'square'/>
                  </div>
                  <p className = {styles.integrationName}>{integration.description}</p>
                  <Link target = '_blank' href = {`https://flow.viasocket.com/makeflow/trigger/${integration.trigger.id}/action?utm_source=integration_page&events=${integration.actions[0].id}&integrations=${integrations.plugins[integration.trigger.name].rowid},${integrations.plugins[integration.actions[0].name].rowid}`} className = {styles.integrationLink}>Try It <span>{'>'}</span></Link>
                </li>
            ))}
            <a className = {styles.moreIntegration} href = {'https://viasocket.com/integrations/' + appslugname} target='_blank'>
              View More Integrations...
            </a>
        </List>
    </div>
  );
};

export default Integrations;
