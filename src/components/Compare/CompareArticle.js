import { useEffect, useState } from "react";
import Link from "next/link";
import CampaignIcon from "@mui/icons-material/Campaign";
import styles from "./CompareArticle.module.scss";

const START_FREE_URL =
  "https://viasocket.com/?utm_source=viasocket&utm_medium=discovery&utm_campaign=discovery-compare&utm_content=sticky";

const LOGO_BASE = "/discovery/compare-logos/brands";

function BrandLogo({ label, file }) {
  return (
    <img
      src={`${LOGO_BASE}/${file}.png`}
      alt={`${label} logo`}
      width="16"
      height="16"
      loading="lazy"
    />
  );
}

function BrowserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
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
    </svg>
  );
}

function PromoIcons() {
  return (
    <div className={styles.strip}>
      <div className={styles.stripRow}>
        <span>2,300+ apps</span>
        <span className={styles.icons}>
          <BrandLogo label="Gmail" file="gmail" />
          <BrandLogo label="Slack" file="slack" />
          <BrandLogo label="HubSpot" file="hubspot" />
          <BrandLogo label="Shopify" file="shopify" />
        </span>
      </div>
      <div className={styles.stripRow}>
        <span className={styles.browserLabel}>
          <BrowserIcon />
          Browser
        </span>
      </div>
      <div className={styles.stripRow}>
        <span>50+ AI models</span>
        <span className={styles.icons}>
          <BrandLogo label="Claude" file="claude" />
          <BrandLogo label="OpenAI" file="openai" />
          <BrandLogo label="Gemini" file="gemini" />
          <BrandLogo label="Mistral" file="mistral" />
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
            {page.readMinutes ? (
              <>
                <span aria-hidden="true"> · </span>
                <span>{page.readMinutes} min read</span>
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
