import Link from "next/link";
import styles from "./Footer.module.scss";
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';


export default function Footer() {
  return (
    <footer
      class="row row-cols-1 row-cols-md-2 row-cols-xl-4 viasocket-faq-footer px-3 px-xl-5"
      style={{ borderTop: "1px solid #ccc" }}
    >
      <div
        style={{
          borderRight: "1px solid #ccc",
          borderLeft: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
        class="d-flex col gap-1 flex-column p-5"
      >
        <a
          href="https://viasocket.com"
          target="_blank"
          aria-label="logo"
          class="via-logo"
        >
          <img
            src="https://viasocket.com/assets/brand/logo.svg"
            alt="viasocket logo"
            width="auto"
            height="30px"
            loading="lazy"
          />
        </a>
        <span style={{ fontSize: "14px" }}>
          © 2024 viaSocket All rights reserved.
        </span>
        <a
          href="https://walkover.in/"
          target="_blank"
          class="small mt-auto text-decoration-none text-black d-flex align-items-center"
        >
          <span style={{ fontSize: "14px" }}>A product of</span>
          <img
            src="https://viasocket.com/assets/brand/walkover.svg"
            alt="walkover"
            width="100"
            height="20"
          />
        </a>
      </div>
      <div
        style={{
          borderRight: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
        class="d-flex col flex-column gap-5 p-5"
      >
        <ul class="list-unstyled d-flex flex-column gap-1">
          <h5 class="mb-0">Solutions</h5>
          <li>
            <a
              href="https://viasocket.com/integrations"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Integrations
            </a>
          </li>
          <li>
            <a
              href="https://cal.id/team/bring-your-app-on-viasocket-marketplace"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              List your app on our marketplace
            </a>
          </li>
          <li>
            <a
              href="https://viasocket.com/faq/developer-hub"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Build Your Own Plug
            </a>
          </li>
          <li>
            <a
              href="https://viasocket.com/templates"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Templates
            </a>
          </li>
        </ul>
      </div>
      <div
        style={{
          borderRight: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
        class="d-flex col flex-column gap-5 p-5"
      >
        <ul class="list-unstyled d-flex flex-column gap-1">
          <h5 class="mb-0">Company</h5>
          <li>
            <a
              href="https://walkover.in/"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="https://walkover.in/careers"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              We Are Hiring
            </a>
          </li>
          <li>
            <a
              href="https://viasocket.com/terms"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Terms of Policy
            </a>
          </li>
          <li>
            <a
              href="https://viasocket.com/privacy"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Privacy policy
            </a>
          </li>
        </ul>
        <div class="d-flex gap-4 mt-auto social-links">
          <a
            href="https://www.instagram.com/walkover.inc/?igsh=MWEyZnptZmw3Z3phOQ%3D%3D"
            aria-label="instagram"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "24px", height: "24px" }}
            class="text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37a4 4 0 1 1-4.74-4.74 4 4 0 0 1 4.74 4.74z"></path>
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/company/viasocket-walkover/"
            aria-label="linkedin"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "24px", height: "24px" }}
            class="text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          <a
            href="https://x.com/viasocket"
            aria-label="twitter"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "24px", height: "24px" }}
            class="text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>

          <a
            href="https://www.youtube.com/@viasocket"
            aria-label="youtube"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "24px", height: "24px" }}
            class="text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29.45 29.45 0 0 0 1 12a29.45 29.45 0 0 0 .47 5.58 2.78 2.78 0 0 0 1.95 1.95c1.71.47 8.59.47 8.59.47s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29.45 29.45 0 0 0 23 12a29.45 29.45 0 0 0-.46-5.58z"></path>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
      </div>
      <div
        style={{
          borderRight: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
        class="d-flex col flex-column gap-5 p-5"
      >
        <ul class="list-unstyled d-flex flex-column gap-1">
          <h5 class="mb-0">Support</h5>
          <li>
            <a
              href="https://viasocket.com/blog"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Blog
            </a>
          </li>
          <li>
            <a
              href="https://viasocket.com/blog/tag/client-story/"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Client Stories
            </a>
          </li>
          <li>
            <a
              href="https://viasocket.com/community/"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Community
            </a>
          </li>
          <li>
            <a
              href="https://roadmap.viasocket.com/b/n0elp3vg/feature-ideas"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Request a feature
            </a>
          </li>
          <li>
            <a
              href="https://calendly.com/rpaliwal71/15-mins"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Talk to Sales
            </a>
          </li>
          <li>
            <a
              href="https://viasocket.com/experts"
              target="_blank"
              class="text-decoration-none text-black"
              style={{ fontSize: "14px" }}
            >
              Hire an Expert
            </a>
          </li>
        </ul>
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
