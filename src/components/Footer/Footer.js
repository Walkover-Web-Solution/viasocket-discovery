import styles from "./Footer.module.scss";

const solutionsLinks = [
  { href: "https://viasocket.com/integrations", label: "Integrations" },
  {
    href: "https://cal.id/team/bring-your-app-on-viasocket-marketplace",
    label: "List your app on our marketplace",
  },
  {
    href: "https://viasocket.com/faq/developer-hub",
    label: "Build Your Own Plug",
  },
  { href: "https://viasocket.com/templates", label: "Templates" },
];

const companyLinks = [
  { href: "https://walkover.in/", label: "About" },
  { href: "https://walkover.in/careers", label: "We Are Hiring" },
  { href: "https://viasocket.com/terms", label: "Terms of Policy" },
  { href: "https://viasocket.com/privacy", label: "Privacy policy" },
];

const supportLinks = [
  { href: "https://viasocket.com/blog", label: "Blog" },
  { href: "https://viasocket.com/community/", label: "Community" },
  {
    href: "https://roadmap.viasocket.com/b/n0elp3vg/feature-ideas",
    label: "Request a feature",
  },
  { href: "https://calendly.com/rpaliwal71/15-mins", label: "Talk to Sales" },
  { href: "https://viasocket.com/experts", label: "Hire an Expert" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/walkover.inc/?igsh=MWEyZnptZmw3Z3phOQ%3D%3D",
    label: "instagram",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37a4 4 0 1 1-4.74-4.74 4 4 0 0 1 4.74 4.74z"></path>
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
      </>
    ),
  },
  {
    href: "https://www.linkedin.com/company/viasocket-walkover/",
    label: "linkedin",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </>
    ),
  },
  {
    href: "https://x.com/viasocket",
    label: "twitter",
    icon: (
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    ),
  },
  {
    href: "https://www.youtube.com/@viasocket",
    label: "youtube",
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29.45 29.45 0 0 0 1 12a29.45 29.45 0 0 0 .47 5.58 2.78 2.78 0 0 0 1.95 1.95c1.71.47 8.59.47 8.59.47s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29.45 29.45 0 0 0 23 12a29.45 29.45 0 0 0-.46-5.58z"></path>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-light border-top mt-5">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-4 d-flex flex-column gap-3">
            <a
              href="https://viasocket.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="viasocket home"
              className="d-inline-flex align-self-start"
            >
              <img
                src="https://viasocket.com/assets/brand/logo.svg"
                alt="viasocket logo"
                width="130"
                height="32"
                loading="lazy"
              />
            </a>
            <p className="small text-secondary mb-0">
              Automate your workflows by connecting your favorite apps — no code
              required.
            </p>
            <div className="d-flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border rounded-circle text-secondary ${styles.socialLink}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-8">
            <div className="row g-4">
              <FooterLinkGroup title="Solutions" links={solutionsLinks} />
              <FooterLinkGroup title="Company" links={companyLinks} />
              <FooterLinkGroup title="Support" links={supportLinks} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-top">
        <div className="container py-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
          <span className="small text-secondary">
            © {new Date().getFullYear()} viaSocket. All rights reserved.
          </span>
          <a
            href="https://walkover.in/"
            target="_blank"
            rel="noopener noreferrer"
            className={`small text-secondary text-decoration-none d-inline-flex align-items-center gap-1 ${styles.walkoverLink}`}
          >
            <span>A product of</span>
            <img
              src="https://viasocket.com/assets/brand/walkover.svg"
              alt="walkover"
              width="90"
              height="18"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }) {
  return (
    <div className="col-6 col-md-4">
      <h6 className="text-uppercase fw-semibold small mb-3">{title}</h6>
      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`small text-secondary text-decoration-none ${styles.footerLink}`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
