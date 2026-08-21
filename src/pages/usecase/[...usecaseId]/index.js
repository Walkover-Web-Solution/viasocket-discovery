import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getUsecaseById,
  getUsecaseByAppSlug,
  getUsecaseByHeadingSlug,
} from "@/services/usecaseServices";
import { getUpdatedApps } from "@/services/integrationServices";
import { getCurrentEnvironment } from "@/utils/storageHelper";
import { getAllUsers, formatDate, nameToSlugName } from "@/utils/utils";
import { deleteUsecaseComment } from "@/utils/apis/usecaseApis";
import { useUser } from "@/context/UserContext";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import AddUsecaseCommentPopup from "@/components/AddCommentPopup/AddUsecaseCommentPopup";
import BuildFlowButton from "@/components/BuildFlowButton/BuildFlowButton";
import ContributeButton from "@/components/ContributeButton/ContributeButton";
import AccentBar from "@/components/AccentBar/AccentBar";
// reuse the exact same comment styling as the blog detail page
import blogStyles from "@/pages/blog/[...blogId]/blogPage.module.scss";
import styles from "./usecasePage.module.scss";
import { FaArrowRightLong, FaChevronDown } from "react-icons/fa6";

// TODO: point this at the real English flow builder entry point once it exists
const FLOW_BUILDER_URL = "https://viasocket.com/signup";

function buildFlowLink(usecase) {
  const params = new URLSearchParams({ prompt: usecase.prompt || "" });
  return `${FLOW_BUILDER_URL}?${params.toString()}`;
}

// each usecase already carries its own flat, deduplicated `apps` list (the
// agent's contract) — no need to walk the flow/branch tree to find app names
function collectUsecaseAppNames(phases, relatedApps) {
  const names = new Set();
  (phases || []).forEach((phase) => {
    (phase.usecases || []).forEach((usecase) => {
      (usecase.apps || []).forEach((entry) => {
        if (entry.app) names.add(entry.app);
      });
    });
  });
  (relatedApps || []).forEach((entry) => {
    if (entry.app) names.add(entry.app);
  });
  return [...names];
}

function isValidMongoId(str) {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

// the canonical URL slug is the page heading itself, so the address bar reads
// the same as the <h1> a visitor sees; related-app cards carry no heading of
// their own, so those fall back to "<app slug>-automation-ideas"
function buildUsecaseSlug(usecase) {
  if (usecase?.h1) return nameToSlugName(usecase.h1);
  const appSlug =
    usecase?.app_slug || (usecase?.app ? nameToSlugName(usecase.app) : "");
  if (!appSlug) return "";
  return appSlug.endsWith("-automation-ideas")
    ? appSlug
    : `${appSlug}-automation-ideas`;
}

async function findUsecaseBySlug(slug, environment) {
  // a heading slug resolves against the stored h1 first
  let usecase = await getUsecaseByHeadingSlug(slug, environment);
  if (!usecase) usecase = await getUsecaseByAppSlug(slug, environment);
  if (!usecase) {
    // headings can carry words after "automation ideas"
    // ("slack-automation-ideas-for-support-teams") — the app slug is the part
    // in front of it
    const strippedSlug = slug.replace(/-automation-ideas.*$/, "");
    if (strippedSlug && strippedSlug !== slug) {
      usecase = await getUsecaseByAppSlug(strippedSlug, environment);
    }
  }
  return usecase;
}

export async function getServerSideProps(context) {
  const { usecaseId } = context.params;
  const firstSegment = Array.isArray(usecaseId) ? usecaseId[0] : usecaseId;
  try {
    const environment = getCurrentEnvironment();
    let usecase = null;

    usecase = await findUsecaseBySlug(firstSegment, environment);

    if (!usecase && isValidMongoId(firstSegment)) {
      usecase = await getUsecaseById(firstSegment, environment);
    }

    if (!usecase) {
      return { notFound: true };
    }

    const flowAppNames = collectUsecaseAppNames(
      usecase.phases,
      usecase.related_apps,
    );
    const usersSet = new Set();
    if (usecase.createdBy != null) usersSet.add(usecase.createdBy);
    (usecase.contributors || []).forEach((id) => usersSet.add(id));
    Object.values(usecase.comments || {}).forEach((comment) =>
      usersSet.add(comment.createdBy),
    );

    const [apps, users] = await Promise.all([
      flowAppNames.length ? getUpdatedApps(flowAppNames, environment) : {},
      getAllUsers(Array.from(usersSet)),
    ]);

    const usersMap = users
      .filter((user) => user !== null)
      .reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

    return {
      props: {
        usecase: JSON.parse(JSON.stringify(usecase)),
        apps,
        users: usersMap,
      },
    };
  } catch (error) {
    console.error("Error fetching usecase data:", error);
    return { notFound: true };
  }
}

function AppIcon({ name, apps }) {
  if (!name) return null;
  const iconUrl = apps?.[name]?.iconUrl;
  return (
    <Avatar
      className="border"
      alt={name}
      src={iconUrl}
      variant="square"
      sx={{ width: 24, height: 24, fontSize: 12 }}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  );
}

function FlowChip({ node, apps, prefix }) {
  return (
    <div className="d-flex align-items-center gap-2 border rounded py-2 px-3 bg-white rounded-pill">
      {/* {prefix && <span className="text-brand fw-bold small">{prefix}</span>} */}
      <AppIcon name={node.app} apps={apps} />
      <span className="small">{node.label}</span>
    </div>
  );
}

// a branch fans out into independent paths (each an ordered chain of nodes,
// possibly containing further nested branches) — rare, most flows are linear
function FlowBranch({ node, apps }) {
  return (
    <div className="d-flex flex-column gap-2 border rounded p-2">
      <span className="text-secondary small fw-bold text-uppercase">
        Splits into
      </span>
      <div className="d-flex flex-wrap gap-3">
        {node.paths.map((path, pathIndex) => (
          <div
            className="d-flex align-items-center flex-wrap gap-2"
            key={pathIndex}
          >
            {path.map((pathNode, nodeIndex) => (
              <FlowNode
                key={nodeIndex}
                node={pathNode}
                apps={apps}
                showArrow={nodeIndex > 0}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowNode({ node, apps, prefix, showArrow }) {
  return (
    <>
      {showArrow && <FaArrowRightLong className="text-secondary" />}
      {node.type === "branch" ? (
        <FlowBranch node={node} apps={apps} />
      ) : (
        <FlowChip node={node} apps={apps} prefix={prefix} />
      )}
    </>
  );
}

function FlowSteps({ flow, apps }) {
  if (!flow?.length) return null;
  return (
    <div className="d-flex align-items-center flex-wrap gap-2 my-3">
      {flow.map((node, index) => (
        <FlowNode
          key={index}
          node={node}
          apps={apps}
          prefix={index === 0 ? "WHEN" : "THEN"}
          showArrow={index > 0}
        />
      ))}
    </div>
  );
}

export default function UsecasePage({ usecase, apps, users }) {
  const [comments, setComments] = useState(usecase?.comments || {});
  const [commentPopup, setCommentPopup] = useState(false);
  const [activeIdea, setActiveIdea] = useState("");
  const { user: currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const slug = buildUsecaseSlug(usecase);
    if (slug) {
      const targetUrl = `/usecase/${slug}`;
      if (
        router.asPath !== targetUrl &&
        router.asPath !== `/automation-ideas${targetUrl}`
      ) {
        router.replace(targetUrl, undefined, { shallow: true });
      }
    }
  }, [usecase?._id, usecase?.h1, usecase?.app, usecase?.app_slug, router.asPath]);

  const phases = usecase?.phases || [];

  // continuous numbering across phases, and ids for the scroll-spy
  let counter = 0;
  const numbered = phases.map((phase) => ({
    ...phase,
    usecases: (phase.usecases || []).map((item) => {
      counter += 1;
      return {
        ...item,
        number: counter,
        ideaId: item.slug || `idea-${counter}`,
      };
    }),
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveIdea(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -80% 0px", threshold: 0 },
    );

    numbered
      .flatMap((phase) => phase.usecases)
      .forEach((item) => {
        const el = document.getElementById(item.ideaId);
        if (el) observer.observe(el);
      });

    return () => observer.disconnect();
  }, [usecase?._id]);

  const handleDeleteComment = async (commentId) => {
    const deleted = await deleteUsecaseComment(commentId, usecase._id);
    if (deleted) {
      setComments((prev) => {
        const updated = { ...prev };
        delete updated[commentId];
        return updated;
      });
    }
  };

  const author = usecase.createdBy != null ? users[usecase.createdBy] : null;

  let activePhaseIndex = -1;
  for (let i = 0; i < numbered.length; i++) {
    if (numbered[i].usecases.some((item) => item.ideaId === activeIdea)) {
      activePhaseIndex = i;
      break;
    }
  }

  return (
    <>
      <Head>
        <title>
          {usecase.meta_title || `${usecase.app} automation ideas | viaSocket`}
        </title>
        <meta
          name="description"
          content={
            usecase.meta_description ||
            `Ready-to-build ${usecase.app} automations${usecase.audience ? ` for ${usecase.audience}` : ""}.`
          }
        />
      </Head>
      <BackToDashboardButton />
      <div className="d-flex flex-column gap-5 mb-4">
        <div className="flex-grow-1">
          <div className="container mb-4">
            <h1 className="display-3 fw-normal mb-2">
              {usecase.h1 || `${usecase.app} automation ideas`}
            </h1>
            {usecase.subheader && <p className="fs-5">{usecase.subheader}</p>}
            {usecase.audience && (
              <p className="fs-5 pb-4">{usecase.audience}</p>
            )}

            <div className="d-flex align-items-center gap-3 flex-wrap">
              {numbered.map((phase, phaseIndex) => {
                const firstIdeaId = phase.usecases[0]?.ideaId;
                return (
                  <a
                    key={phase.phase}
                    href={firstIdeaId ? `#${firstIdeaId}` : undefined}
                    className={`border py-2 px-3 small rounded-pill text-decoration-none ${styles.pill}`}
                    style={
                      activePhaseIndex === phaseIndex
                        ? { backgroundColor: "black", color: "white" }
                        : {}
                    }
                    onClick={(event) => {
                      // smooth scrolling is the enhancement; the href alone
                      // already jumps to the phase without any JavaScript
                      const target = firstIdeaId
                        ? document.getElementById(firstIdeaId)
                        : null;
                      if (!target) return;
                      event.preventDefault();
                      target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    {phase.name} {phase.usecases.length}
                  </a>
                );
              })}
            </div>
          </div>

          {numbered.map((phase, phaseIndex) => {
            const bgColors = [
              "rgb(242, 236, 226)",
              "rgb(234, 239, 232)",
              "rgb(247, 234, 231)",
            ];
            return (
              <div
                key={phase.phase}
                style={{
                  backgroundColor: bgColors[phaseIndex % bgColors.length],
                }}
              >
                <div
                  className={`container d-flex flex-column gap-5 py-5 ${phaseIndex === 0 ? "border-top" : ""}`}
                >
                  {phase.usecases.map((item, itemIndex) => (
                    <div
                      key={item.ideaId}
                      id={item.ideaId}
                      className="pb-4 border-bottom"
                    >
                      {itemIndex === 0 && (
                        <div className="d-flex align-items-center gap-3 mb-4">
                          <AccentBar />
                          <span className="mustHave mb-0">{phase.name}</span>
                          <span
                            className="rounded-pill bg-secondary"
                            style={{ padding: "2px 2px" }}
                          ></span>
                          <p className="text-secondary mb-0">
                            {phase.usecases.length} Ideas
                          </p>
                        </div>
                      )}

                      <div className={styles.ideaLayout}>
                        <div>
                          <h4 className="fw-bold">
                            {item.number}. {item.title}
                          </h4>
                          <p className="pb-4">{item.description}</p>
                        </div>
                        <div>
                          <FlowSteps flow={item.flow} apps={apps} />
                          <BuildFlowButton
                            href={buildFlowLink(item)}
                            prompt={item.prompt || item.description}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {usecase.related_apps?.length > 0 ? (
            <div className="container mt-5">
              <h2 className="pb-2">Ideas for related apps</h2>
              <div className="d-flex flex-wrap gap-3 pb-4">
                {usecase.related_apps.map((entry) => {
                  const relatedSlug = buildUsecaseSlug(entry);
                  const card = (
                    <>
                      <AppIcon name={entry.app} apps={apps} />
                      {entry.app}
                    </>
                  );
                  const cardClass =
                    "border rounded py-2 px-3 bg-white d-flex align-items-center gap-2";
                  return relatedSlug ? (
                    <Link
                      key={entry.app_slug || entry.app}
                      href={`/usecase/${relatedSlug}`}
                      className={`${cardClass} text-reset text-decoration-none`}
                    >
                      {card}
                    </Link>
                  ) : (
                    <div
                      key={entry.app_slug || entry.app}
                      className={cardClass}
                    >
                      {card}
                    </div>
                  );
                })}
              </div>
              <Link
                href={`https://viasocket.com/integrations/${usecase.app_slug}`}
                className="text-brand text-decoration-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                See everything {usecase.app} connects to
              </Link>
            </div>
          ) : (
            <div className="container mt-5 d-flex align-items-center gap-3 flex-wrap">
              <p className="mb-2 fs-4">
                Browse every app we have automation ideas for.
              </p>
              <Link
                href="/"
                className="text-decoration-underline text-brand d-flex gap-2 align-items-center"
              >
                Check Other Apps
                <FaArrowRightLong />
              </Link>
            </div>
          )}

          {comments && Object.keys(comments).length > 0 && (
            <div className={`container ${blogStyles.commentContainer}`}>
              <h2 className={blogStyles.responses}>Contributors</h2>
              {Object.entries(comments).map(([commentId, comment]) => (
                <div key={commentId} className={blogStyles.comment}>
                  <div className={blogStyles.commentHeader}>
                    <div className={blogStyles.userDetails}>
                      <Link href={`/user/${comment.createdBy}`} target="_blank">
                        {users[comment.createdBy]?.name
                          ?.charAt(0)
                          .toUpperCase() +
                          users[comment.createdBy]?.name?.slice(1)}
                        ,
                      </Link>
                      <span className={blogStyles.commentDate}>
                        {formatDate(new Date(comment.createdAt))}
                      </span>
                    </div>
                    {comment.createdBy == currentUser?.id && (
                      <button
                        onClick={() => handleDeleteComment(commentId)}
                        className={blogStyles.deleteButton}
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                  <div>
                    <p className={blogStyles.commentText}>
                      {typeof comment.text === "object"
                        ? comment.text?.text
                        : comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {usecase.faqs?.length > 0 && (
          <div className="container mt-5">
            <h2 className="pb-2">Frequently asked questions</h2>
            {/* native <details>, not the Bootstrap accordion: bootstrap.js is
                imported in an effect, so a collapsed panel would be stuck shut
                for a crawler or a visitor without JavaScript */}
            <div className="border-top pb-4">
              {usecase.faqs.map((faq, faqIndex) => (
                <details
                  key={faq.question || faqIndex}
                  className={`border-bottom ${styles.faq}`}
                  open={faqIndex === 0}
                >
                  <summary
                    className={`d-flex align-items-center justify-content-between gap-3 py-3 ${styles.faqSummary}`}
                  >
                    <h3 className="h6 fw-bold mb-0">{faq.question}</h3>
                    <FaChevronDown className={styles.faqChevron} />
                  </summary>
                  <div className="pb-3">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className="container d-flex align-items-center gap-3 justify-content-between py-4">
          <div className="d-flex align-items-center gap-2">
            <div
              className="border rounded-pill p-1 d-flex align-items-center justify-content-center small"
              style={{ width: "28px", height: "28px", fontSize: "12px" }}
            >
              {author?.name
                ?.split(" ")
                .map((n) => n.charAt(0).toUpperCase())
                .join("") || "?"}
            </div>
            <span className="text-secondary small">Written by</span>
            <span className="fw-normal">{author?.name || "Unknown"}</span>
          </div>
          <span className="text-secondary small">
            {usecase.createdAt ? formatDate(new Date(usecase.createdAt)) : ""}
          </span>
        </div>
      </div>

      <AddUsecaseCommentPopup
        open={commentPopup}
        onClose={() => setCommentPopup(false)}
        setComments={setComments}
        usecaseId={usecase?._id}
      />

      <ContributeButton onClick={() => setCommentPopup(true)} />
    </>
  );
}
