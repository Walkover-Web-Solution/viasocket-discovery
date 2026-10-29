import { useEffect, useState } from "react";
import Link from "next/link";
import CampaignIcon from "@mui/icons-material/Campaign";
import styles from "./CompareArticle.module.scss";

const START_FREE_URL =
  "https://viasocket.com/?utm_source=viasocket&utm_medium=discovery&utm_campaign=discovery-compare&utm_content=sticky";

function BrandIcon({ label, children, viewBox = "0 0 24 24" }) {
  return (
    <svg viewBox={viewBox} width="16" height="16" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function PromoIcons() {
  return (
    <div className={styles.strip}>
      <div className={styles.stripRow}>
        <span>2,300+ apps</span>
        <span className={styles.icons}>
          <BrandIcon label="Gmail">
            <path
              fill="#EA4335"
              d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
            />
          </BrandIcon>
          <BrandIcon label="Slack">
            <path
              fill="#E01E5A"
              d="M6 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 2 2v-2H7z"
            />
            <path
              fill="#36C5F0"
              d="M9 6a2 2 0 1 1 2-2v2H9zm0 1a2 2 0 1 1 2 2V7H9z"
            />
            <path
              fill="#2EB67D"
              d="M18 9a2 2 0 1 1 2 2h-2V9zm-1 0a2 2 0 1 1-2 2v-2h2z"
            />
            <path
              fill="#ECB22E"
              d="M15 18a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 1 1-2-2v2h2z"
            />
          </BrandIcon>
          <BrandIcon label="HubSpot">
            <circle cx="12" cy="12" r="5.2" fill="none" stroke="#FF7A59" strokeWidth="2.2" />
            <circle cx="12" cy="12" r="1.7" fill="#FF7A59" />
            <circle cx="12" cy="4.2" r="1.5" fill="#FF7A59" />
            <circle cx="18.6" cy="8.2" r="1.5" fill="#FF7A59" />
            <circle cx="18.6" cy="15.8" r="1.5" fill="#FF7A59" />
            <circle cx="12" cy="19.8" r="1.5" fill="#FF7A59" />
            <circle cx="5.4" cy="15.8" r="1.5" fill="#FF7A59" />
            <circle cx="5.4" cy="8.2" r="1.5" fill="#FF7A59" />
          </BrandIcon>
          <BrandIcon label="Shopify">
            <path fill="#95BF47" d="M7 7.2h10l-.9 12.2H7.9L7 7.2z" />
            <path
              fill="none"
              stroke="#fff"
              strokeWidth="1.6"
              d="M9.2 7.4c.2-2.2 1.4-3.6 2.8-3.6s2.6 1.4 2.8 3.6"
            />
          </BrandIcon>
        </span>
      </div>
      <div className={styles.stripRow}>
        <span className={styles.browserLabel}>
          <BrandIcon label="Browser">
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
              fill="none"
              stroke="#1f1a17"
              strokeWidth="1.6"
            />
            <path stroke="#1f1a17" strokeWidth="1.6" d="M3 9h18" />
            <circle cx="6.2" cy="7" r="0.8" fill="#1f1a17" />
            <circle cx="8.6" cy="7" r="0.8" fill="#1f1a17" />
          </BrandIcon>
          Browser
        </span>
      </div>
      <div className={styles.stripRow}>
        <span>50+ AI models</span>
        <span className={styles.icons}>
          <BrandIcon label="OpenAI">
            <circle cx="12" cy="12" r="9" fill="#111111" />
            <path
              d="M12 6.2l1.6 3.4h3.6l-2.9 2.2 1.1 3.5L12 13.2 8.6 15.3l1.1-3.5-2.9-2.2h3.6L12 6.2z"
              fill="#fff"
            />
          </BrandIcon>
          <BrandIcon label="Anthropic">
            <circle cx="12" cy="12" r="9" fill="#D4A27F" />
            <path
              fill="#1f1a17"
              d="M12 4.2l1.3 4.8 4.8 1-3.6 2.8 1.4 4.7L12 15.2l-4 2.3 1.4-4.7-3.6-2.8 4.8-1L12 4.2z"
            />
          </BrandIcon>
          <BrandIcon label="Gemini">
            <path
              fill="#4C8BF5"
              d="M12 2.2l1.7 6.4 6.6 1.2-5.2 3.6 2 6.4L12 16.4 6.9 19.8l2-6.4L3.7 9.8l6.6-1.2L12 2.2z"
            />
          </BrandIcon>
          <BrandIcon label="Mistral">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#FF7000" />
            <path
              fill="#fff"
              d="M7 17V7.2h2.1l3.2 5.1V7.2H14.4V17h-2.1l-3.3-5.2V17H7z"
            />
          </BrandIcon>
        </span>
      </div>
    </div>
  );
}

function PromoBody({ visible }) {
  return (
    <>
      <p className={styles.pitch}>
        Add 2,300+ apps to your product or AI agent.
      </p>
      <PromoIcons />
      <a
        className={styles.cta}
        href={START_FREE_URL}
        tabIndex={visible ? undefined : -1}
      >
        Start free
      </a>
    </>
  );
}

function currentHeadingId(headings) {
  const marker = 180;
  let current = headings[0]?.id || "";
  headings.forEach((heading) => {
    const element = document.getElementById(heading.id);
    if (!element) return;
    if (element.getBoundingClientRect().top <= marker) current = heading.id;
  });
  return current;
}

export default function CompareArticle({ page }) {
  const [activeId, setActiveId] = useState(page.headings[0]?.id || "");
  const [promoVisible, setPromoVisible] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);

  useEffect(() => {
    const update = () => {
      setPromoVisible(window.scrollY > 240);
      if (page.headings.length) setActiveId(currentHeadingId(page.headings));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [page.headings]);

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {page.headings.length ? (
          <nav className={styles.toc} aria-label="On this page">
            <div className={styles.tocInner}>
              <p className={styles.tocLabel}>On this page</p>
              <ol className={styles.tocList}>
                {page.headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={
                        heading.id === activeId
                          ? styles.tocLinkActive
                          : styles.tocLink
                      }
                      aria-current={
                        heading.id === activeId ? "location" : undefined
                      }
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        ) : (
          <div className={styles.toc} />
        )}

        <article className={styles.articleColumn}>
          {page.headings.length ? (
            <label className={styles.jump}>
              <span>Jump to section</span>
              <select
                value={activeId}
                onChange={(event) => {
                  const id = event.target.value;
                  const element = document.getElementById(id);
                  if (element) element.scrollIntoView({ block: "start" });
                  setActiveId(id);
                }}
              >
                {page.headings.map((heading) => (
                  <option key={heading.id} value={heading.id}>
                    {heading.text}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Discovery</Link>
            <span aria-hidden="true">/</span>
            <Link href="/compare">Compare</Link>
            <span aria-hidden="true">/</span>
            <span>{page.title}</span>
          </nav>
          <h1>{page.title}</h1>
          <p className={styles.byline}>
            {page.authorId ? (
              <Link href={`/user/${encodeURIComponent(page.authorId)}`}>
                {page.authorName || "Author"}
              </Link>
            ) : (
              <span>{page.authorName}</span>
            )}
            {page.publishedLabel ? (
              <>
                <span aria-hidden="true"> · </span>
                <time dateTime={page.publishedAt}>{page.publishedLabel}</time>
              </>
            ) : null}
            {page.category ? (
              <span className={styles.category}>{page.category}</span>
            ) : null}
          </p>
          <div
            className={styles.article}
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
          <aside className={styles.contact} aria-label="Suggestions">
            <div className={styles.contactIcon} aria-hidden="true">
              <CampaignIcon className={styles.contactGlyph} />
            </div>
            <div>
              <p className={styles.contactTitle}>
                Have suggestions or improvements for this article?
              </p>
              <p className={styles.contactText}>
                Reach out to us at{" "}
                <a href="mailto:discovery@viasocket.com">
                  discovery@viasocket.com
                </a>
                .
              </p>
            </div>
          </aside>
        </article>

        <div className={styles.sideColumn}>
          <aside
            className={
              promoVisible
                ? `${styles.sideCard} ${styles.sideCardVisible}`
                : styles.sideCard
            }
            aria-hidden={promoVisible ? undefined : true}
          >
            <PromoBody visible={promoVisible} />
          </aside>
        </div>
      </div>

      {!barDismissed ? (
        <div
          className={
            promoVisible
              ? `${styles.bottomBar} ${styles.bottomBarVisible}`
              : styles.bottomBar
          }
          aria-hidden={promoVisible ? undefined : true}
        >
          <div className={styles.bottomInner}>
            <PromoBody visible={promoVisible} />
            <button
              type="button"
              className={styles.close}
              aria-label="Close"
              onClick={() => setBarDismissed(true)}
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
