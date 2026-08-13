import React from "react";
import styles from "./razorpay.module.scss";
import BuildFlowButton from "@/components/BuildFlowButton/BuildFlowButton";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import WorkflowStep from "@/components/WorkflowStep/WorkflowStep";
import razorpayAutomationData from "@/data/razorpayAutomationData";
import AccentBar from "@/components/AccentBar/AccentBar";

const sections = razorpayAutomationData;

const RazorpayAutomationIdeasPage = () => {
  const [activeIdea, setActiveIdea] = React.useState("");

  const activeSectionIndex = React.useMemo(() => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].ideas.some((idea) => idea.id === activeIdea)) {
        return i;
      }
    }
    return -1;
  }, [activeIdea]);

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
      <div className="d-flex flex-column gap-5 mb-4">
        <div className="flex-grow-1">
          <div className="container mb-4">
            <h1 className="display-3 fw-normal mb-3">
              Razorpay automation ideas
            </h1>
            <p className="fs-5 pb-4">
              Turn Razorpay payments into booked sessions, timely follow ups,{" "}
              <br />
              better customer experiences, and smarter payment recovery.
            </p>

            <div className="d-flex align-items-center gap-3">
              <p
                className={`border py-2 px-3 small rounded-pill cursor-pointer ${styles.pill}`}
                style={
                  activeSectionIndex === 0
                    ? { backgroundColor: "black", color: "white" }
                    : {}
                }
                onClick={() =>
                  document
                    .getElementById(sections[0].ideas[0].id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                Must to have 2
              </p>
              <p
                className={`border py-2 px-3 small rounded-pill cursor-pointer ${styles.pill}`}
                style={
                  activeSectionIndex === 1
                    ? { backgroundColor: "black", color: "white" }
                    : {}
                }
                onClick={() =>
                  document
                    .getElementById(sections[1].ideas[0].id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                High value 6
              </p>
              <p
                className={`border py-2 px-3 small rounded-pill cursor-pointer ${styles.pill}`}
                style={
                  activeSectionIndex === 2
                    ? { backgroundColor: "black", color: "white" }
                    : {}
                }
                onClick={() =>
                  document
                    .getElementById(sections[2].ideas[0].id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                AI workflows 4
              </p>
            </div>
          </div>

          {sections.map((section, sectionIndex) => {
            const bgColors = [
              "rgb(242, 236, 226)",
              "rgb(234, 239, 232)",
              "rgb(247, 234, 231)",
            ];
            return (
              <div
                key={section.title}
                style={{ backgroundColor: bgColors[sectionIndex] }}
              >
                <div className={`container d-flex flex-column gap-5 py-5 ${sectionIndex === 0 ? "border-top" : ""}`}>
                  {section.ideas.map((idea, ideaIndex) => (
                    <div
                      key={idea.id}
                      id={idea.id}
                      className="pb-4 border-bottom"
                    >
                      {ideaIndex === 0 && sectionIndex === 0 && (
                        <div className="d-flex align-items-center gap-3 mb-4">
                          {/* <p className="text-brand fw-semibold pb-1">PHASE 1</p> */}
                          <AccentBar />
                          <span className="mustHave mb-0">{section.title}</span>
                          <span
                            className="rounded-pill bg-secondary"
                            style={{ padding: "2px 2px" }}
                          ></span>
                          <p className="text-secondary mb-0">
                            {section.ideaCount}2 Ideas
                          </p>
                        </div>
                      )}
                      {ideaIndex === 0 && sectionIndex === 1 && (
                        <div className="d-flex align-items-center gap-3 mb-4">
                          <AccentBar />
                          <span className="mustHave mb-0">{section.title}</span>
                          <span
                            className="rounded-pill bg-secondary"
                            style={{ padding: "2px 2px" }}
                          ></span>
                          <p className="text-secondary mb-0">
                            {section.ideaCount}6 Ideas
                          </p>
                        </div>
                      )}
                      {ideaIndex === 0 && sectionIndex === 2 && (
                        <div className="d-flex align-items-center gap-3 mb-4">
                          <AccentBar />
                          <span className="mustHave mb-0">{section.title}</span>
                          <span
                            className="rounded-pill bg-secondary"
                            style={{ padding: "2px 2px" }}
                          ></span>
                          <p className="text-secondary mb-0">
                            {section.ideaCount}4 Ideas
                          </p>
                        </div>
                      )}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "6rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <h4 className="fw-bold">{idea.text}</h4>
                          <p className="pb-4">{idea.description}</p>
                        </div>
                        <div>
                          {idea.workflow && (
                            <WorkflowStep steps={idea.workflow} />
                          )}
                          <BuildFlowButton href="https://viasocket.com/signup" prompt={idea.description} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="container d-flex align-items-center gap-3 justify-content-between py-4">
          <div className="d-flex align-items-center gap-2">
            <div
              className="border rounded-pill p-1 d-flex align-items-center justify-content-center small"
              style={{ width: "28px", height: "28px", fontSize: "12px" }}
            >
              RM{" "}
            </div>
            <span className="text-secondary small">Written by</span>
            <span className="fw-normal">Ragini Mahobiya</span>
          </div>
          <span className="text-secondary small">July 29, 2026</span>
        </div>
      </div>
    </>
  );
};

export default RazorpayAutomationIdeasPage;
