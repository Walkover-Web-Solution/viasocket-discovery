import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsecaseById } from "@/services/usecaseServices";
import { getUpdatedApps } from "@/services/integrationServices";
import { getCurrentEnvironment } from "@/utils/storageHelper";
import { getAllUsers, formatDate } from "@/utils/utils";
import { deleteUsecaseComment } from "@/utils/apis/usecaseApis";
import { useUser } from "@/context/UserContext";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import AddUsecaseCommentPopup from "@/components/AddCommentPopup/AddUsecaseCommentPopup";
import StickySidebar from "@/components/StickySidebar/StickySidebar";
import BuildFlowButton from "@/components/BuildFlowButton/BuildFlowButton";
import AuthorRow from "@/components/AuthorSection/AuthorRow";
import ContributeButton from "@/components/ContributeButton/ContributeButton";
// reuse the exact same comment styling as the blog detail page
import styles from "@/pages/blog/[...blogId]/blogPage.module.scss";
import { FaArrowRightLong } from "react-icons/fa6";

// TODO: point this at the real English flow builder entry point once it exists
const FLOW_BUILDER_URL = "https://viasocket.com/flows/new";

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

export async function getServerSideProps(context) {
  const { usecaseId } = context.params;
  try {
    const environment = getCurrentEnvironment();
    const usecase = await getUsecaseById(usecaseId, environment);
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
    <div className="d-flex align-items-center gap-2 border rounded-pill py-2 px-3 bg-white">
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
      {showArrow && <FaArrowRightLong className="text-brand" />}
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
    <div className="d-flex align-items-center flex-wrap gap-4 my-3">
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

  const phases = usecase?.phases || [];

  // continuous numbering across phases, and ids for the sticky sidebar / scroll-spy
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

  const sidebarSections = numbered.map((phase) => ({
    title: phase.name,
    ideas: phase.usecases.map((item) => ({
      id: item.ideaId,
      text: `${item.number}. ${item.title}`,
    })),
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

  return (
    <>
      <Head>
        <title>{`${usecase.app} automation ideas | viaSocket`}</title>
        <meta
          name="description"
          content={`Ready-to-build ${usecase.app} automations${usecase.audience ? ` for ${usecase.audience}` : ""}.`}
        />
      </Head>
      <BackToDashboardButton />
      <div className="container d-flex gap-5 my-4">
        <div className="flex-grow-1 pe-5 me-5">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="text-brand fw-semibold pb-2">AUTOMATION IDEAS</p>
              <h1 className="pb-3">{usecase.app} automation ideas</h1>
              {usecase.audience && (
                <p className="fs-5 pb-4">{usecase.audience}</p>
              )}
            </div>
          </div>
          <AuthorRow user={author} date={usecase.createdAt} />

          <div className="d-flex flex-column gap-5">
            {numbered.map((phase) => (
              <section key={phase.phase}>
                {phase.name && (
                  <div className="pb-4">
                    <p className="text-brand fw-semibold pb-1">
                      PHASE {phase.phase}
                    </p>
                    <h3>{phase.name}</h3>
                  </div>
                )}
                <div className="d-flex flex-column gap-5">
                  {phase.usecases.map((item) => (
                    <div
                      id={item.ideaId}
                      key={item.ideaId}
                      className="pb-5 border-bottom"
                    >
                      <h3 className="fs-4">
                        {item.number}. {item.title}
                      </h3>
                      <p className="pb-4">{item.description}</p>
                      <FlowSteps flow={item.flow} apps={apps} />
                      <BuildFlowButton href={buildFlowLink(item)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {usecase.related_apps?.length > 0 && (
              <div className="mt-5">
                <h2 className="pb-2">Ideas for related apps</h2>
                <div className="d-flex flex-wrap gap-3 pb-4">
                  {usecase.related_apps.map((entry) => (
                    <div
                      key={entry.app_slug}
                      className="border rounded py-2 px-3 bg-white d-flex align-items-center gap-2"
                    >
                      <AppIcon name={entry.app} apps={apps} />
                      {entry.app}
                    </div>
                  ))}
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
            )}
          </div>

          {comments && Object.keys(comments).length > 0 && (
            <div className={styles.commentContainer}>
              <h2 className={styles.responses}>Contributors</h2>
              {Object.entries(comments).map(([commentId, comment]) => (
                <div key={commentId} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <div className={styles.userDetails}>
                      <Link href={`/user/${comment.createdBy}`} target="_blank">
                        {users[comment.createdBy]?.name
                          ?.charAt(0)
                          .toUpperCase() +
                          users[comment.createdBy]?.name?.slice(1)}
                        ,
                      </Link>
                      <span className={styles.commentDate}>
                        {formatDate(new Date(comment.createdAt))}
                      </span>
                    </div>
                    {comment.createdBy == currentUser?.id && (
                      <button
                        onClick={() => handleDeleteComment(commentId)}
                        className={styles.deleteButton}
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                  <div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <StickySidebar sections={sidebarSections} activeIdea={activeIdea} />
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
