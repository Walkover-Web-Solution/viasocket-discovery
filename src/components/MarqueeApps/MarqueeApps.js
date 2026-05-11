import React from 'react';
import styles from './MarqueeApps.module.scss';

const MarqueeApps = () => {
    const appsRow1 = [
        { name: 'Slack', domain: 'slack.com' },
        { name: 'Notion', domain: 'notion.so' },
        { name: 'HubSpot', domain: 'hubspot.com' },
        { name: 'Salesforce', domain: 'salesforce.com' },
        { name: 'Asana', domain: 'asana.com' },
        { name: 'Jira', domain: 'atlassian.com' },
        { name: 'GitHub', domain: 'github.com' },
        { name: 'Stripe', domain: 'stripe.com' },
        { name: 'Trello', domain: 'trello.com' },
        { name: 'Google', domain: 'google.com' },
        { name: 'Discord', domain: 'discord.com' },
        { name: 'Figma', domain: 'figma.com' },
        { name: 'Linear', domain: 'linear.app' },
        { name: 'Intercom', domain: 'intercom.com' },
        { name: 'Zoom', domain: 'zoom.us' },
        { name: 'Monday', domain: 'monday.com' },
        { name: 'Loom', domain: 'loom.com' }
    ];

    const appsRow2 = [
        { name: 'Zendesk', domain: 'zendesk.com' },
        { name: 'Dropbox', domain: 'dropbox.com' },
        { name: 'Calendly', domain: 'calendly.com' },
        { name: 'Webflow', domain: 'webflow.com' },
        { name: 'ClickUp', domain: 'clickup.com' },
        { name: 'Airtable', domain: 'airtable.com' },
        { name: 'Twilio', domain: 'twilio.com' },
        { name: 'Pipedrive', domain: 'pipedrive.com' },
        { name: 'Amplitude', domain: 'amplitude.com' },
        { name: 'Mixpanel', domain: 'mixpanel.com' },
        { name: 'Shopify', domain: 'shopify.com' },
        { name: 'Freshdesk', domain: 'freshdesk.com' },
        { name: 'Mailchimp', domain: 'mailchimp.com' },
        { name: 'Klaviyo', domain: 'klaviyo.com' },
        { name: 'Typeform', domain: 'typeform.com' },
        { name: 'Supabase', domain: 'supabase.com' },
        { name: 'Notion', domain: 'notion.so' },
        { name: 'Buffer', domain: 'buffer.com' }
    ];

    const renderIcons = (apps) => (
        apps.map((app, index) => (
            <img 
                key={`${app.name}-${index}`}
                className={`${styles.iconPill} rounded-0 bg-white border p-1`} 
                src={`https://logo.clearbit.com/${app.domain}`} 
                alt={app.name} 
                width="48" 
                height="48" 
                loading="lazy" 
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://www.google.com/s2/favicons?domain=${app.domain}&sz=64`;
                }}
            />
        ))
    );

    return (
        <div className={`${styles.iconsStrip} my-5 py-5 overflow-hidden`}>
            <div className={`${styles.iconsTrack} ${styles.iconsTrackFwd} d-flex gap-0 mb-2`}>
                <div className="d-flex gap-2 pe-2">
                    {renderIcons(appsRow1)}
                </div>
                <div className="d-flex gap-2 pe-2" aria-hidden="true">
                    {renderIcons(appsRow1)}
                </div>
                <div className="d-flex gap-2 pe-2" aria-hidden="true">
                    {renderIcons(appsRow1)}
                </div>
                <div className="d-flex gap-2 pe-2" aria-hidden="true">
                    {renderIcons(appsRow1)}
                </div>
            </div>
            <div className={`${styles.iconsTrack} ${styles.iconsTrackRev} d-flex gap-0`}>
                <div className="d-flex gap-2 pe-2">
                    {renderIcons(appsRow2)}
                </div>
                <div className="d-flex gap-2 pe-2" aria-hidden="true">
                    {renderIcons(appsRow2)}
                </div>
                <div className="d-flex gap-2 pe-2" aria-hidden="true">
                    {renderIcons(appsRow2)}
                </div>
                <div className="d-flex gap-2 pe-2" aria-hidden="true">
                    {renderIcons(appsRow2)}
                </div>
            </div>
        </div>
    );
};

export default MarqueeApps;
