import React from "react";
import { FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";
import styles from "./razorpay.module.scss";
import StickySidebar from "@/components/StickySidebar/StickySidebar";
import BuildFlowButton from "@/components/BuildFlowButton/BuildFlowButton";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import WorkflowStep from "@/components/WorkflowStep/WorkflowStep";
import razorpayAutomationData from "@/data/razorpayAutomationData";

const sections = razorpayAutomationData;

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
    <>
      <BackToDashboardButton />
      <div className="container d-flex gap-5 my-4">
        <div
          className="flex-grow-1 pe-5 me-5"
          style={{ backgorundColor: "red" }}
        >
          <p className="text-brand fw-semibold mb-3">AUTOMATION IDEAS</p>
          <h1 className={`${styles.title} pb-3`}>Razorpay automation ideas</h1>
          <p className="fs-5 pb-4">
            Turn Razorpay payments into booked sessions, timely follow ups,
            better customer experiences, and smarter payment recovery.
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
                RM{" "}
              </div>
              <span className="fw-semibold me-2">Ragini Mahobiya</span>
              <span className="text-secondary">July 29, 2026</span>
            </div>
          </div>

          <div className="d-flex flex-column gap-5">
            {sections.map((section, sectionIndex) => (
              <React.Fragment key={section.title}>
                {section.ideas.map((idea, ideaIndex) => (
                  <div
                    key={idea.id}
                    id={idea.id}
                    className="pb-4 border-bottom"
                  >
                    {ideaIndex === 0 && sectionIndex === 0 && (
                      <div className="pb-4">
                        <p className="text-brand fw-semibold pb-1">PHASE 1</p>
                        <h3 className="mustHave">{section.title}</h3>
                      </div>
                    )}
                    {ideaIndex === 0 && sectionIndex === 1 && (
                      <div className="pb-4">
                        <p className="text-brand fw-semibold pb-1">PHASE 2</p>
                        <h5 className="mustHave">{section.title}</h5>
                      </div>
                    )}
                    {ideaIndex === 0 && sectionIndex === 2 && (
                      <div className="pb-4">
                        <p className="text-brand fw-semibold pb-1">PHASE 3</p>
                        <h5 className="mustHave">{section.title}</h5>
                      </div>
                    )}

                    <h3 className="fs-4">{idea.text}</h3>
                    <p className="pb-4">{idea.description}</p>
                    {idea.workflow && <WorkflowStep steps={idea.workflow} />}
                    <BuildFlowButton />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <StickySidebar sections={sections} activeIdea={activeIdea} />
      </div>
    </>
  );
};

export default RazorpayAutomationIdeasPage;
