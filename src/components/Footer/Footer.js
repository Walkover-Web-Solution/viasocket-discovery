import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`border-dark border-left border-right d-flex flex-lg-row flex-column-reverse ${styles.footerContainer}`}>
        {/* Footer Left Section */}
        <div className={`border-dark border-bottom border-left ${styles.footerLeft} flex-lg-grow-1`}>
          <div className={styles.footerLogo}>
            <Link href="/" aria-label="socket fav icon">
              <img
                src="https://viasocket.com/assets/brand/socket_fav_dark.svg"
                alt="viasocket logo"
                width="46"
                height="46"
              />
            </Link>
            <p>© 2024 viaSocket</p>
            <p>All rights reserved.</p>
          </div>
          <div className={`mt-auto ${styles.footerProduct}`}>
            <span>A product of</span>
            <Link
              href="https://walkover.in/"
              target="_blank"
              aria-label="walkover"
            >
              <img
                src="https://viasocket.com/assets/brand/walkover.svg"
                alt="walkover"
                width="100"
                height="20"
              />
            </Link>
          </div>
        </div>

        {/* Footer Right Section */}
        <div className={`border-dark border-bottom border-left flex-lg-grow-1 ${styles.footerRight}`}>
          <div className={`${styles.footerColumn} ${styles.columnBorder}`}>
            <FooterGroup
              title="Solutions"
              links={[
                { href: "https://viasocket.com/integrations", label: "Integrations" },
                {
                  href: "https://cal.id/team/bring-your-app-on-viasocket-marketplace",
                  label: "List your app on our marketplace",
                },
              ]}
            />
            <FooterGroup
              title="Compare"
              links={[
                { href: "https://viasocket.com/faq/viasocket-vs-zapier", label: "ViaSocket vs Zapier" },
                { href: "https://viasocket.com/faq/viasocket-vs-make", label: "ViaSocket vs Make" },
                { href: "https://viasocket.com/blog/viasocket-vs-pabbly", label: "ViaSocket vs Pabbly" },
              ]}
            />
          </div>
          <div className={`${styles.footerColumn} ${styles.columnBorder}`}>
            <FooterGroup
              title="Company"
              links={[
                { href: "https://walkover.in/", label: "About" },
                {
                  href: "https://www.google.com/search?q=walkover+linkedin",
                  label: "We Are Hiring",
                },
                { href: "https://viasocket.com/terms", label: "Terms of Policy" },
                { href: "https://viasocket.com/terms", label: "Privacy Policy" },
              ]}
            />
            <FooterGroup
              title="Get Help"
              links={[
                { href: "https://viasocket.com/faq/startup-policy", label: "Startups Policy" },
                { href: "https://calendly.com/rpaliwal71/15-mins", label: "Talk to Sales" },
                { href: "https://viasocket.com/experts", label: "Hire an Expert" },
              ]}
            />
          </div>
          <div className={styles.footerColumn}>
            <FooterGroup
              title="Resources"
              links={[
                { href: "https://viasocket.com/blog", label: "Blog" },
                { href: "https://viasocket.com/blog/tag/client-story", label: "Client Stories" },
                { href: "https://viasocket.com/faq/help-section", label: "Knowledge Base" },
                { href: "https://viasocket.com/community", label: "Community" },
                { href: "https://roadmap.viasocket.com/b/n0elp3vg/feature-ideas", label: "Request a Feature" },
              ]}
            />
            <div className={styles.footerSocial}>
              <Link href="https://www.instagram.com/walkover.inc/">
                <i className="fab fa-instagram" />
              </Link>
              <Link href="https://www.linkedin.com/company/viasocket-walkover/">
                <i className="fab fa-linkedin" />
              </Link>
              <Link href="https://x.com/viasocket">
                <i className="fab fa-twitter" />
              </Link>
              <Link href="https://www.youtube.com/@viasocket">
                <i className="fab fa-youtube" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }) {
  return (
    <div className={styles.group}>
      <h2 className={styles.groupTitle}>{title}</h2>
      <div className={styles.groupItems}>
        {links.map((link, index) => (
          <Link href={link.href} key={index} aria-label={link.label}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
