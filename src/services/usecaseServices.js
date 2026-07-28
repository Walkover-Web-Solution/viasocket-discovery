import { askAi, generateNanoid } from '@/utils/utils';
import dbConnect from '../../lib/mongoDb';
import createUsecaseModel from '../../models/UsecaseModel';

const USECASE_AGENT_ID = '6a67605a4264663da02f62cf';

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

async function saveUsecaseRecord(appList, data, userId, environment) {
    try {
        await withUsecaseModel(environment, (Usecase) =>
            Usecase.create({
                apps: appList,
                data,
                createdBy: userId ?? null,
            }),
        );
    } catch (err) {
        console.error('error saving generated usecase ', err);
    }
}

export async function getUsecases({ userId, app, limit, environment } = {}) {
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

        const cappedLimit = Math.min(parseInt(limit) || 20, 100);

        return Usecase.find(query)
            .sort({ createdAt: -1 })
            .limit(cappedLimit)
            .lean();
    });
}

export async function suggestAppUsecases(apps, message, { userId, environment } = {}) {
    const appList = normalizeApps(apps);
    if (!appList.length) throw new Error('apps is required');

    const appNames = appList.map((entry) => entry.app);
    const userMessage = message?.trim()
        ? `Apps: ${appNames.join(', ')} \n Requirement: ${message.trim()}`
        : `Apps: ${appNames.join(', ')}`;

    const data = await askAi(USECASE_AGENT_ID, userMessage, { apps: appList, message: message || '' });
    const parsed = parseAgentResponse(data);

    await saveUsecaseRecord(appList, parsed, userId, environment);

    return parsed;
}
