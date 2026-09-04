const axios = require("axios");

async function getPluginsByName(pluginNames, fields, environment, firstTime) {
  const url = `${process.env.DBDASH_URL}/${process.env.PLUGINS_DBID}/${process.env.PLUGINS_TABLEID}`;
  const escapedNames = pluginNames
    .map((p) => `'${p.replace(/'/g, "''")}'`)
    .join(",");
  const plugins = await axios
    .get(url, {
      params: {
        filter: `name ILIKE ANY (ARRAY[${escapedNames}]) AND audience = 'Public'`,
        fields: fields,
      },
      headers: {
        "auth-key": process.env.PLUGINS_AUTHKEY,
      },
    })
    .catch((err) => {
      console.error(err);
    })
    .then((res) => res.data.data.rows);

  let pluginsSet = pluginNames.reduce((acc, name) => {
    acc[name.toLowerCase()] = name;
    return acc;
  }, {});

  plugins.forEach((plugin) => {
    const name = plugin.name.toLowerCase();
    delete pluginsSet[name];
  });
  if (environment === "prod" && firstTime)
    alertMissingPlugins(Object.values(pluginsSet));
  return plugins;
}

async function getIntegrations(pluginNames, environment) {
  const plugins = await getPluginsByName(pluginNames, [], environment);
  const allIntegrations = await Promise.allSettled(
    plugins.map((plugin) => {
      return axios.get(
        "https://socket-plug-services-h7duexlbuq-el.a.run.app/api/v1/plugins/recommend/integrations",
        {
          params: {
            service: plugin.appslugname,
          },
          headers: {
            "auth-key": process.env.RECOMM_AUTHKEY,
          },
        },
      );
    }),
  ).then((res) => {
    return Object.fromEntries(
      res
        .map((res, idx) => [plugins[idx].name.toLowerCase(), res])
        .filter((res) => res[1].status === "fulfilled")
        .map((res) => [res[0], res[1].value.data]),
    );
  });
  return allIntegrations;
}
async function alertMissingPlugins(plugins) {
  await axios
    .post(`https://flow.sokt.io/func/scriq2u5Tbwc`, {
      missingPlugins: [...plugins],
    })
    .catch((err) => console.error("Error in alerting", err));
}

// the plug service caps every response at 200 rows no matter what limit we ask
// for, so the full catalogue (~7.5k apps) can only be had by walking it page by
// page. caching the walk per category keeps those requests off the hot path
// after the first hit, which is what makes searching the whole catalogue
// affordable instead of a request storm on every keystroke.
const PLUGINS_PAGE_SIZE = 200;
const PLUGINS_MAX_PAGES = 100;
const PLUGINS_CACHE_TTL = 10 * 60 * 1000;
const appsCache = new Map();
const appsInFlight = new Map();

async function fetchAllPlugins(category) {
  const NEXT_PUBLIC_PLUG_SERVICE_URL = process.env.NEXT_PUBLIC_PLUG_SERVICE_URL;
  const apps = [];
  let complete = false;

  for (let page = 0; page < PLUGINS_MAX_PAGES; page++) {
    let rows;
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PLUG_SERVICE_URL}/api/v1/plugins/all`,
        {
          params: {
            category,
            limit: PLUGINS_PAGE_SIZE,
            offset: page * PLUGINS_PAGE_SIZE,
          },
        },
      );
      rows = response?.data?.data || [];
    } catch (error) {
      // keep whatever pages did arrive rather than losing the whole catalogue,
      // but leave it uncached so the next request retries the missing tail
      console.error(
        "Error fetching apps by category:",
        error?.response?.data || error.message,
      );
      break;
    }
    apps.push(...rows);
    if (rows.length < PLUGINS_PAGE_SIZE) {
      complete = true;
      break;
    }
  }

  return { apps, complete };
}

async function getAppsByCategory(category) {
  const key = category && category !== "All" ? category : "";
  const cached = appsCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.apps;

  // parallel requests for the same category share one walk
  const pending = appsInFlight.get(key);
  if (pending) return pending;

  const walk = fetchAllPlugins(key)
    .then(({ apps, complete }) => {
      if (complete) {
        appsCache.set(key, { apps, expiresAt: Date.now() + PLUGINS_CACHE_TTL });
      }
      return apps.length ? apps : cached?.apps || [];
    })
    .finally(() => {
      appsInFlight.delete(key);
    });

  appsInFlight.set(key, walk);
  return walk;
}

async function getUpdatedApps(pluginNames, environment) {
  try {
    const apiIcons = await getPluginsByName(
      pluginNames,
      ["name", "iconurl", "domain"],
      environment,
      true,
    );
    const iconMap = apiIcons.reduce((acc, plugin) => {
      acc[plugin.name.toLowerCase()] = {
        iconUrl: plugin.iconurl,
        domain: plugin.domain,
      };
      return acc;
    }, {});
    const apps = pluginNames?.reduce((acc, appName) => {
      if (
        iconMap[appName.toLowerCase()]?.iconUrl ||
        iconMap[appName.toLowerCase()]?.domain
      ) {
        acc[appName] = {
          iconUrl: iconMap[appName.toLowerCase()]?.iconUrl,
          domain: iconMap[appName.toLowerCase()]?.domain,
        };
      } else acc[appName] = {};
      return acc;
    }, {});
    return apps;
  } catch (error) {
    console.error("error in getting app icon urls ", error);

    const apps = pluginNames?.reduce((acc, app) => {
      acc[app] = {};
      return acc;
    }, {});
    return apps;
  }
}
module.exports = { getPluginsByName, getIntegrations, getUpdatedApps, getAppsByCategory };
