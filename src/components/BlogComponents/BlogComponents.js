import { appNameToId, dummyMarkdown, nameToSlugName } from "@/utils/utils";
import { Avatar, List, ListItem } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./BlogComponents.module.scss";
import Integrations from "../Integrations/Integrations";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ExtensionIcon from "@mui/icons-material/Extension";
import InfoIcon from "@mui/icons-material/Info";
import BlogHeader from "../BlogHeader/BlogHeader";
import BlogSummary from "../BlogSummary/BlogSummary";
import Link from "next/link";
import HtmlTooltip from "@mui/material/Tooltip";

const Components = {
  title: (props) => <BlogHeader {...props} />,

  sub_title: ({ content }) => (
    <div className={styles.subTitleContainer}>
      <h2 className={styles.subTitle}>{content}</h2>
    </div>
  ),
  summaryList: (props) => {
    return (
      <div className={styles.summaryList}>
        <BlogSummary {...props} />
      </div>
    );
  },
  detailedReviews: ({ content, integrations, appBlogs, apps }) => {
    return (
      <div className={styles.detailedReviews} id="detailed-reviews">
        <h4 className="heading_h2">📖 In Depth Reviews</h4>
        <div className={styles.howWeAssess}>
          <p>
            We independently review every app we recommend We independently
            review every app we recommend
            <HtmlTooltip
              className={styles.tooltip}
              title={
                <React.Fragment>
                  <p className="fs-6">
                    At AppDiscovery, our best apps roundups are written by
                    humans who thoroughly review, test, and write about SaaS
                    services and apps. Human insight is involved at every step,
                    from research and testing to writing and editing. Each
                    article then undergoes a 7-day review process to ensure
                    accuracy. We never accept payment for app placements or
                    links—we value the trust our readers place in us for honest,
                    unbiased evaluations. For more details on how we select apps
                    to feature, read the full process –
                    <a
                      style={{ color: "blue", textDecoration: "underline" }}
                      href="https://viasocket.com/blog/how-we-choose-apps-to-feature-on-app-discovery"
                      target="_blank"
                    >
                      How We Choose Apps to Feature on App Discovery
                    </a>
                  </p>
                </React.Fragment>
              }
            >
              <InfoIcon className={styles.infoIcon} />
            </HtmlTooltip>
          </p>
        </div>
        <List>
          {content.map(({ appName, content }, idx) => (
            <ListItem
              className={`${styles.listItem} fs-6`}
              key={idx}
              id={appNameToId(appName)}
            >
              <div className={`my-3 ${styles.appTitleDiv}`}>
                <a
                  className={styles.appDomain}
                  href={
                    apps[appName]?.domain
                      ? `https://${apps[appName].domain}`
                      : `https://www.google.com/search?q=${appName}`
                  }
                  target="_blank"
                >
                  <div className={styles.appHeadingDiv}>
                    <Avatar
                      className={styles.appIcon}
                      alt={appName}
                      src={
                        integrations?.[appName.toLowerCase()]?.plugins[
                          nameToSlugName(appName)
                        ]?.iconurl
                      }
                      variant="square"
                    >
                      <ExtensionIcon />
                    </Avatar>
                    <h5>{appName}</h5>
                  </div>
                </a>
                <div className={styles.buttons}>
                  {apps[appName]?.domain && (
                    <Link
                      className="btn btn-outline-dark"
                      href={`https://${apps[appName].domain}`}
                      target="_blank"
                    >
                      Visit Website{" "}
                      <ArrowOutwardIcon
                        fontSize="small"
                        className={styles.arrowIcon}
                      />
                    </Link>
                  )}
                  {integrations?.[appName.toLowerCase()] && (
                    <Link
                      className="btn btn-dark"
                      href={`https://viasocket.com/integrations/${nameToSlugName(
                        appName,
                      )}`}
                      target="_blank"
                    >
                      View Integrations{" "}
                      <ArrowOutwardIcon
                        fontSize="small"
                        className={styles.arrowIcon}
                      />
                    </Link>
                  )}
                </div>
              </div>
              <ReactMarkdown
                className={styles.content}
                remarkPlugins={[remarkGfm]}
              >
                {content}
              </ReactMarkdown>
              <Integrations
                integrations={integrations?.[appName.toLowerCase()]}
                appslugname={nameToSlugName(appName)}
              />
              {appBlogs[appName]?.length > 0 && (
                <div className={styles.relatedBlogsDiv}>
                  {appBlogs[appName]?.length > 0 && (
                    <h6>
                      {" "}
                      Explore More on <strong>{appName}</strong>
                    </h6>
                  )}
                  <ul>
                    {appBlogs[appName]?.map((blog) => {
                      return (
                        <li key={blog.id}>
                          <a
                            className={styles.relatedBlogsLink}
                            href={`/discovery/blog/${blog.id}/${
                              blog?.meta?.category
                                ? `${blog.meta.category}/`
                                : ""
                            }${nameToSlugName(blog.slugName)}`}
                            target="_blank"
                          >
                            {blog.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    );
  },
  dummy: () => (
    <ReactMarkdown className={styles.dummyMarkdown} remarkPlugins={[remarkGfm]}>
      {dummyMarkdown}
    </ReactMarkdown>
  ),
  additionalSection: ({ content, heading }) => (
    <section
      className={`blog-page__section mb-4 p-2 w-75`}
    >
      {heading && <h3>{heading}</h3>}
      <div className="bp-table-wrap">
        <ReactMarkdown className={`d-flex flex-column gap-4 ${styles.content}`} remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </section>
  ),
};

export default Components;
