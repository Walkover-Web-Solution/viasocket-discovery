const axios = require('axios');

async function getPluginsByName(pluginNames, fields) {
    const url = `${process.env.DBDASH_URL}/${process.env.PLUGINS_DBID}/${process.env.PLUGINS_TABLEID}`
    const plugins = await axios.get(url, {
        params: {
            filter: `name ILIKE ANY (ARRAY[${pluginNames.map(p => `'${p}'`)}]) AND audience = 'Public' AND status = 'published'`,
            fields: fields
        },
        headers: {
            'auth-key' : process.env.PLUGINS_AUTHKEY    
        }
    }).catch(err => {
        console.log(err);
    }).then(res => res.data.data.rows);
    const pluginsSet = new Set(pluginNames);
    plugins.forEach(plugin => pluginsSet.delete(plugin));
    alertMissingPlugins([...pluginsSet]);
    return plugins;
}

async function getIntegrations(pluginNames){
    const plugins = await getPluginsByName(pluginNames);
    const allIntegrations = await Promise.allSettled(plugins.map(plugin => {
        return axios.get('https://socket-plug-services-h7duexlbuq-el.a.run.app/api/v1/plugins/recommend/integrations', 
            {
                params: {
                    service: plugin.appslugname
                },
                headers: {
                    'auth-key' : process.env.RECOMM_AUTHKEY
                }
            }
        )
    })).then(res => {
        return Object.fromEntries(
          res
            .map((res, idx) => [plugins[idx].name.toLowerCase(), res])
            .filter((res) => res[1].status === "fulfilled")
            .map((res) => [res[0], res[1].value.data])
        );
    })
    return allIntegrations;
    // const integrations = [], pluginData = {};
    // for(let integration of allIntegrations) {
    //     Object.assign(pluginData, integration.plugins);
    // }
    // let i = 0, count = new Set([-1]);
    // while(integrations.length < 5 && count.has(i/allIntegrations.length-1)){
    //     let integrationIdx = i % allIntegrations.length, combinationIdx = i / allIntegrations.length;
    //     if(allIntegrations[integrationIdx]?.combinations?.[combinationIdx]){
    //         integrations.push(allIntegrations[integrationIdx]?.combinations?.[combinationIdx]);
    //         count.add(combinationIdx);
    //     }
    //     i++;
    // }
    // return {integrations, pluginData};
}
async function alertMissingPlugins(plugins){
    await axios.put(`${process.env.DBDASH_URL}/66e3d66c31fab5e9d2693958/tblwed90e`, 
        {
            uniqueField: 'name',
            rows : plugins.map(plugin => ({
                name : plugin
            }))
        }, 
        {
            headers : {
                'auth-key': process.env.DBDASH_ALERT_AUTHKEY
            }
        }
    ).catch(err => console.error('Error in alerting', err));
}

async function getUpdatedApps(blogData) {
    const appContent = blogData?.blog?.find(section => section.section === 'summaryList')?.content;
    try {
        const pluginNames = appContent?.map(app => app.name) || [];

        const apiIcons = await getPluginsByName(pluginNames, ['name', 'iconurl', 'domain']);
        const iconMap = apiIcons.reduce((acc, plugin) => {
            acc[plugin.name.toLowerCase()] = {
                iconUrl: plugin.iconurl,
                domain: plugin.domain
            };
            return acc;
        }, {});
        const apps = appContent?.reduce((acc, app) => {
            if (iconMap[app.name.toLowerCase()]?.iconUrl || iconMap[app.name.toLowerCase()]?.domain) {
                acc[app.name] = {
                    iconUrl: iconMap[app.name.toLowerCase()]?.iconUrl  ,
                    domain: iconMap[app.name.toLowerCase()]?.domain  
                };
            } else acc[app.name] = {};
            return acc;
        }, {});
        return apps;
    } catch (error) {
        console.log("error in getting app icon urls ", error);
        
        const apps = appContent?.reduce((acc, app) => {
            acc[app.name] = {};
            return acc;
        }, {});
        return apps;
    }
}
module.exports = { getPluginsByName, getIntegrations, getUpdatedApps }