import React from "react";
import Link from "next/link";
import { FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";
import styles from "./razorpay-automation-ideas.module.scss";
import {
  SiStripe,
  SiShopify,
  SiZoho,
  SiHubspot,
  SiSlack,
  SiGooglesheets,
} from "react-icons/si";
import StickySidebar from "@/components/StickySidebar/StickySidebar";
import BuildFlowButton from "@/components/BuildFlowButton/BuildFlowButton";

const sections = [
  {
    title: "Must-have",
    ideas: [
      {
        id: "idea-1",
        text: "1. Generate Razorpay Payment Link from Google Forms",
      },
      {
        id: "idea-2",
        text: "2. Generate Razorpay Payment Link from Tally Forms",
      },
    ],
  },
  {
    title: "High value",
    ideas: [
      {
        id: "idea-3",
        text: "3. Create Google Calendar Event After Successful Payment",
      },
      { id: "idea-4", text: "4. Notify Owner About High-Value Payment" },
      { id: "idea-5", text: "5. Follow Up on Expired Payment Link" },
      { id: "idea-6", text: "6. Ask Customer for Refund Feedback" },
      { id: "idea-7", text: "7. Unlock Premium Content After Payment" },
      { id: "idea-8", text: "8. Automatically Send Invoice After Payment" },
    ],
  },
  {
    title: "AI workflows",
    ideas: [
      { id: "idea-9", text: "9. AI Classify High-Value Customers" },
      { id: "idea-10", text: "10. AI Generate Personalized Thank-You Message" },
      { id: "idea-11", text: "11. AI Analyze Refund Reasons" },
      { id: "idea-12", text: "12. AI Recover Failed Payments" },
    ],
  },
];

const RazorpayAutomationIdeasPage = () => {
  const [activeIdea, setActiveIdea] = React.useState("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIdea(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px",
        threshold: 0,
      },
    );

    const ideaElements = document.querySelectorAll('[id^="idea-"]');
    ideaElements.forEach((element) => observer.observe(element));

    return () => {
      ideaElements.forEach((element) => observer.unobserve(element));
    };
  }, []);
  return (
    <div className="container d-flex gap-5 my-5">
      <div className="flex-grow-1 pe-5 me-5">
        <p className="text-brand fw-semibold pb-2">AUTOMATION IDEAS</p>
        <h1 className={`${styles.title} pb-3`}>Razorpay automation ideas</h1>
        <p className="fs-5 pb-4">
          Turn Razorpay payments into booked sessions, timely follow ups, better
          customer experiences, and smarter payment recovery.
        </p>
        <div className="d-flex align-items-center pb-5">
          <div className="d-flex align-items-center">
            <div className="d-flex gap-3 text-secondary me-3">
              <div
                className="border p-1 d-flex align-items-center justify-content-center"
                style={{ width: "26px", height: "26px" }}
              >
                <FaLinkedinIn />
              </div>
              <div
                className="border p-1 d-flex align-items-center justify-content-center"
                style={{ width: "26px", height: "26px" }}
              >
                <FaFacebookF />
              </div>
              <div
                className="border p-1 d-flex align-items-center justify-content-center"
                style={{ width: "26px", height: "26px" }}
              >
                <FaTwitter />
              </div>
            </div>
            <div
              className="border p-1 d-flex align-items-center justify-content-center me-2"
              style={{ width: "26px", height: "26px", fontSize: "12px" }}
            >
              VR
            </div>
            <span className="fw-semibold me-2">Vaishali Raghuvanshi</span>
            <span className="text-secondary">July 29, 2026</span>
          </div>
        </div>

        <div className="d-flex flex-column gap-5">
          <div id="idea-1" className="pb-4 ragini border-bottom">
            <div className="pb-4">
              <p className="text-brand fw-semibold pb-1">PHASE 1</p>
              <h3 className="mustHave">Must-have</h3>
            </div>

            <h3 className="fs-4">
              1. Generate Razorpay Payment Link from Google Forms
            </h3>
            <p className="pb-4">
              Automatically create a Razorpay Payment Link whenever a customer
              submits a service request or booking form.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-2" className="pb-4 border-bottom">
            <div className="pb-4">
              <p className="text-brand fw-semibold pb-1">PHASE 2</p>
              <h5 className="mustHave">High value</h5>
            </div>
            <h3 className="fs-4">
              2. Generate Razorpay Payment Link from Tally Forms
            </h3>
            <p className="pb-4">
              Automatically generate a Razorpay Payment Link when a customer
              submits a Tally Form.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-3" className="pb-4 border-bottom">
            <h3 className="fs-4">
              3. Create Google Calendar Event After Successful Payment
            </h3>
            <p className="pb-4">
              Automatically schedule a consultation, onboarding call, or booked
              session after payment.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-4" className="pb-4 border-bottom">
            <h3 className="fs-4">4. Notify Owner About High-Value Payment</h3>
            <p className="pb-4">
              Notify the business owner only when a payment exceeds a
              configurable amount.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-5" className="pb-4 border-bottom">
            <h3 className="fs-4">5. Follow Up on Expired Payment Link</h3>
            <p className="pb-4">
              Recover lost sales by automatically generating a fresh payment
              link and sending it to the customer after the previous link
              expires.
            </p>

            <BuildFlowButton />
          </div>

          <div id="idea-6" className="pb-4 border-bottom">
            <h3 className="fs-4">6. Ask Customer for Refund Feedback</h3>
            <p className="pb-4">
              Automatically collect customer feedback after a refund is
              processed.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-7" className="pb-4 border-bottom">
            <h3 className="fs-4">7. Unlock Premium Content After Payment</h3>
            <p className="pb-4">
              Grant access to paid resources immediately after successful
              payment.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-8" className="pb-4 border-bottom">
            <div className="pb-4">
              <p className="text-brand fw-semibold pb-1">PHASE 3</p>
              <h3 className="mustHave">AI workflows</h3>
            </div>
            <h3 className="fs-4">
              8. Automatically Send Invoice After Payment
            </h3>
            <p className="pb-4">
              Razorpay does not automatically send a Razorpay Invoice after a
              Payment Link payment. Their own FAQ states this is not supported
              automatically.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-9" className="pb-4 border-bottom">
            <h3 className="fs-4">9. AI Classify High-Value Customers</h3>
            <p className="pb-4">
              Identify VIP customers automatically based on payment value and
              purchasing behaviour.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-10" className="pb-4 border-bottom">
            <h3 className="fs-4">
              10. AI Generate Personalized Thank-You Message
            </h3>
            <p className="pb-4">
              Generate a personalized thank-you message for high-value
              customers.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-11" className="pb-4 border-bottom">
            <h3 className="fs-4">11. AI Analyze Refund Reasons</h3>
            <p className="pb-4">
              Categorize customer refund feedback using AI to identify recurring
              issues and trends.
            </p>
            <BuildFlowButton />
          </div>

          <div id="idea-12" className="pb-4">
            <h3 className="fs-4">12. AI Recover Failed Payments</h3>
            <p className="pb-4">
              Generate a personalized payment recovery message after a failed
              payment attempt.
            </p>
            <BuildFlowButton />
          </div>

          <div className="mt-5">
            <h2 className="relatedAppsTitle pb-2">Ideas for related apps</h2>
            <div className="d-flex flex-wrap gap-3 pb-4">
              <div
                className={`border rounded py-2 px-3 bg-white d-flex align-items-center gap-2`}
              >
                <SiStripe /> Stripe
              </div>
              <div
                className={`border rounded py-2 px-3 bg-white d-flex align-items-center gap-2`}
              >
                <SiShopify /> Shopify
              </div>
              <div
                className={`border rounded py-2 px-3 bg-white d-flex align-items-center gap-2`}
              >
                <SiZoho /> Zoho Books
              </div>
              <div
                className={`border rounded py-2 px-3 bg-white d-flex align-items-center gap-2`}
              >
                <SiHubspot /> HubSpot
              </div>
              <div
                className={`border rounded py-2 px-3 bg-white d-flex align-items-center gap-2`}
              >
                <SiSlack /> Slack
              </div>
              <div
                className={`border rounded py-2 px-3 bg-white d-flex align-items-center gap-2`}
              >
                <SiGooglesheets /> Google Sheets
              </div>
            </div>
            <Link href="#" className="text-brand text-decoration-underline">
              See everything Razorpay connects to
            </Link>
          </div>
        </div>
      </div>
      <StickySidebar sections={sections} activeIdea={activeIdea} />
    </div>
  );
};

export default RazorpayAutomationIdeasPage;
