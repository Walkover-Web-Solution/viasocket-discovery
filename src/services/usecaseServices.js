import { askAi, generateNanoid } from '@/utils/utils';
import dbConnect from '../../lib/mongoDb';
import createUsecaseModel from '../../models/UsecaseModel';

const USECASE_AGENT_ID = '6a67605a4264663da02f62cf';
const CHECK_AND_UPDATE_AGENT_ID = '6a6882884264663da031e9c1';

function parseAgentResponse(data) {
    const content = data?.response?.data?.content;
    if (!content) throw new Error('Empty response from usecase agent');
    if (typeof content === 'object') return content;
    try {
        return JSON.parse(content);
    } catch (err) {
        throw new Error('Invalid JSON from usecase agent');
    }
}

function normalizeApps(apps) {
    const list = Array.isArray(apps) ? apps : [apps];
    return list
        .map((entry) => {
            if (!entry) return null;
            if (typeof entry === 'string') {
                return { app: entry, app_slug: generateNanoid() };
            }
            if (!entry.app) return null;
            return { app: entry.app, app_slug: entry.app_slug || generateNanoid() };
        })
        .filter(Boolean);
}

async function withUsecaseModel(environment, callback) {
    const connection = await dbConnect(environment);
    const Usecase = createUsecaseModel(connection);
    return callback(Usecase);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tagUsecasesWithContributor(data, userId) {
    const phases = data?.phases || [];
    phases.forEach((phase) => {
        (phase.usecases || []).forEach((usecase) => {
            usecase.addedBy = userId ?? null;
            usecase.addedAt = new Date().toISOString();
        });
    });
    return data;
}

// exact match: same set of app names, case-insensitive, order-independent
async function findExistingUsecase(appList, environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        const patterns = appList.map(
            (entry) => new RegExp(`^${escapeRegExp(entry.app)}$`, 'i'),
        );
        return Usecase.findOne({
            apps: {
                $size: appList.length,
                $all: patterns.map((pattern) => ({ $elemMatch: { app: pattern } })),
            },
        })
            .sort({ createdAt: -1 })
            .lean();
    });
}

async function saveUsecaseRecord(appList, data, userId, environment) {
    try {
        tagUsecasesWithContributor(data, userId);
        const created = await withUsecaseModel(environment, (Usecase) =>
            Usecase.create({
                apps: appList,
                app: data.app,
                app_slug: data.app_slug,
                audience: data.audience,
                phases: data.phases || [],
                createdBy: userId ?? null,
                contributors: userId != null ? [userId] : [],
            }),
        );
        return created._id;
    } catch (err) {
        console.error('error saving generated usecase ', err);
        return null;
    }
}

export async function updateUsecaseWithRequest(usecaseId, message, { userId, environment } = {}) {
    return withUsecaseModel(environment, async (Usecase) => {
        const usecaseDoc = await Usecase.findById(usecaseId);
        if (!usecaseDoc) throw new Error('Usecase not found');

        const agentResponse = await askAi(CHECK_AND_UPDATE_AGENT_ID, message, {
            id: usecaseId,
            message,
            usecase: {
                app: usecaseDoc.app,
                app_slug: usecaseDoc.app_slug,
                audience: usecaseDoc.audience,
                phases: usecaseDoc.phases,
            },
        });
        const result = parseAgentResponse(agentResponse);

        if (!result?.approved) {
            return { approved: false, reason: result?.reason || 'Request was not approved', usecases: [] };
        }

        const newUsecases = result.usecases || [];
        if (newUsecases.length) {
            newUsecases.forEach((usecase) => {
                usecase.addedBy = userId ?? null;
                usecase.addedAt = new Date().toISOString();
            });

            const phases = usecaseDoc.phases || [];
            const targetPhase =
                phases.find((phase) => phase.phase === result.phase) || phases[phases.length - 1];

            if (targetPhase) {
                targetPhase.usecases = [...(targetPhase.usecases || []), ...newUsecases];
            }

            usecaseDoc.markModified('phases');

            if (userId != null && !usecaseDoc.contributors.includes(userId)) {
                usecaseDoc.contributors.push(userId);
            }

            await usecaseDoc.save();
        }

        return { approved: true, reason: result.reason, usecases: newUsecases };
    });
}

export async function getUsecaseById(usecaseId, environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        return Usecase.findById(usecaseId).lean();
    });
}

export async function createComment(usecaseId, commentData, environment) {
    try {
        return withUsecaseModel(environment, async (Usecase) => {
            const commentId = generateNanoid(5);
            const comment = {
                text: commentData.text,
                createdBy: commentData.createdBy,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: commentData.status || 'pending',
            };

            await Usecase.updateOne(
                { _id: usecaseId },
                {
                    $set: {
                        [`comments.${commentId}`]: comment,
                        toUpdate: true,
                    },
                },
            );

            return { commentId, ...comment };
        });
    } catch (err) {
        console.error('Error creating usecase comment', err);
    }
}

export async function getAllComments(usecaseId, environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        const usecaseDoc = await Usecase.findById(usecaseId);
        if (!usecaseDoc) throw new Error('Usecase not found');
        return usecaseDoc.comments;
    });
}

export async function getCommentById(usecaseId, commentId, environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        const usecaseDoc = await Usecase.findById(usecaseId);
        if (!usecaseDoc || !usecaseDoc.comments?.[commentId]) {
            throw new Error('Comment not found');
        }
        return usecaseDoc.comments[commentId];
    });
}

export async function updateComment(usecaseId, commentId, commentData, environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        const updateData = {
            text: commentData.text,
            status: commentData.status,
            updatedAt: new Date(),
        };

        await Usecase.updateOne(
            { _id: usecaseId },
            { $set: { [`comments.${commentId}`]: updateData } },
        );

        return updateData;
    });
}

export async function deleteComment(usecaseId, commentId, userId, environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        const usecaseDoc = await Usecase.findById(usecaseId);
        if (!usecaseDoc) throw new Error('Usecase not found');

        const comment = usecaseDoc.comments[commentId];
        if (!comment) throw new Error('Comment not found');
        if (comment.createdBy != userId) throw new Error('You are not authorized to delete this comment');

        let toUpdate = false;
        Object.entries(usecaseDoc.comments).forEach(([key, otherComment]) => {
            if (key != commentId && otherComment.status == 'pending') {
                toUpdate = true;
            }
        });

        return await Usecase.updateOne(
            { _id: usecaseId },
            {
                $unset: { [`comments.${commentId}`]: '' },
                $set: { toUpdate },
            },
        );
    });
}

export function getUsecasesToMergeComments(environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        return Usecase.find({ toUpdate: true }, { _id: 1 });
    });
}

// picked up by the cron endpoint (usecase equivalent of updateBlogUsingComments) —
// batches all pending comments on a usecase into one review+apply call using
// the same CHECK_AND_UPDATE_AGENT_ID this file already calls for direct requests.
export async function updateUsecaseUsingComments(usecaseId, environment) {
    return withUsecaseModel(environment, async (Usecase) => {
        const usecaseDoc = await Usecase.findById(usecaseId);
        if (!usecaseDoc) throw new Error('Usecase not found');

        const comments = usecaseDoc.comments || {};
        const pendingEntries = Object.entries(comments).filter(([, comment]) => comment.status === 'pending');

        if (!pendingEntries.length) {
            usecaseDoc.toUpdate = false;
            await usecaseDoc.save();
            return { approved: false, reason: 'No pending comments', usecases: [] };
        }

        const message = pendingEntries.map(([, comment]) => comment.text).join('\n');

        const agentResponse = await askAi(CHECK_AND_UPDATE_AGENT_ID, message, {
            id: usecaseId,
            message,
            usecase: {
                app: usecaseDoc.app,
                app_slug: usecaseDoc.app_slug,
                audience: usecaseDoc.audience,
                phases: usecaseDoc.phases,
            },
        });
        const result = parseAgentResponse(agentResponse);

        if (result?.approved) {
            const newUsecases = result.usecases || [];
            if (newUsecases.length) {
                newUsecases.forEach((usecase) => {
                    usecase.addedBy = null;
                    usecase.addedAt = new Date().toISOString();
                });

                const phases = usecaseDoc.phases || [];
                const targetPhase =
                    phases.find((phase) => phase.phase === result.phase) || phases[phases.length - 1];

                if (targetPhase) {
                    targetPhase.usecases = [...(targetPhase.usecases || []), ...newUsecases];
                }
                usecaseDoc.markModified('phases');
            }

            pendingEntries.forEach(([commentId, comment]) => {
                usecaseDoc.comments[commentId].status = 'approved';
                if (comment.createdBy != null && !usecaseDoc.contributors.includes(comment.createdBy)) {
                    usecaseDoc.contributors.push(comment.createdBy);
                }
            });
        } else {
            pendingEntries.forEach(([commentId]) => {
                usecaseDoc.comments[commentId].status = 'rejected';
                usecaseDoc.comments[commentId].reason = result?.reason || 'Request was not approved';
            });
        }

        usecaseDoc.markModified('comments');
        usecaseDoc.toUpdate = false;
        await usecaseDoc.save();

        return { approved: !!result?.approved, reason: result?.reason, usecases: result?.usecases || [] };
    });
}

const MAX_PAGE_SIZE = 10;

export async function getUsecases({ userId, app, page, limit, environment } = {}) {
    return withUsecaseModel(environment, async (Usecase) => {
        const query = {};

        if (userId) {
            query.createdBy = parseInt(userId);
        }

        if (app) {
            const pattern = new RegExp(`^${escapeRegExp(app)}$`, 'i');
            query.apps = {
                $elemMatch: {
                    $or: [{ app: pattern }, { app_slug: pattern }],
                },
            };
        }

        const cappedLimit = Math.min(parseInt(limit) || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
        const currentPage = Math.max(parseInt(page) || 1, 1);
        const skip = (currentPage - 1) * cappedLimit;

        const [usecases, total] = await Promise.all([
            Usecase.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(cappedLimit)
                .lean(),
            Usecase.countDocuments(query),
        ]);

        return {
            usecases,
            pagination: {
                page: currentPage,
                limit: cappedLimit,
                total,
                totalPages: Math.ceil(total / cappedLimit) || 1,
                hasMore: skip + usecases.length < total,
            },
        };
    });
}

export async function suggestAppUsecases(apps, message, { userId, environment, override } = {}) {
    const appList = normalizeApps(apps);
    if (!appList.length) throw new Error('apps is required');

    if (!override) {
        const existing = await findExistingUsecase(appList, environment);
        if (existing) {
            return {
                app: existing.app,
                app_slug: existing.app_slug,
                audience: existing.audience,
                phases: existing.phases,
                alreadyExists: true,
                usecaseId: existing._id,
            };
        }
    }

    const appNames = appList.map((entry) => entry.app);
    const userMessage = message?.trim()
        ? `Apps: ${appNames.join(', ')} \n Requirement: ${message.trim()}`
        : `Apps: ${appNames.join(', ')}`;

    const data = await askAi(USECASE_AGENT_ID, userMessage, { apps: appList, message: message || '' });
    const parsed = parseAgentResponse(data);

    const usecaseId = await saveUsecaseRecord(appList, parsed, userId, environment);

    return { ...parsed, alreadyExists: false, usecaseId };
}
