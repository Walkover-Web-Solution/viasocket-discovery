import blogServices from "@/services/blogServices";
import { addNewCategories, addNewParmeters, addNewTags, getAllTagsCategoriesAndParameters } from "@/services/tagsServices";
import { askAi, nameToSlugName } from "@/utils/utils";
import axios from "axios";


const applyReplacements = (responseMap, bridgeMap, updateFunc) => {
  Object.entries(responseMap.replaced).forEach(([original, replacements]) => {
    replacements.forEach(replacement => {
      bridgeMap[replacement]?.forEach(id => {
        updateFunc(id, original, replacement);
      });
    });
  });
};

export default async function handler(req, res) {
  const environment = req.headers['env'];
  const { method } = req;
  const MERGE_TAGS_BRIDGE_ID = "670d05b53d8054efee36bd5e";
  const MERGE_PARAMETERS_BRIDGE_ID = "671a3327c3ecf2f46f924ca8"
  const MERGE_CATGORIES_BRIDGE_ID = "671b3104c3ecf2f46f924caa"
  switch (method) {
    case 'POST':
      try {
        const allBLogTags = await blogServices.getAllBlogTags(environment) // all blog that are created or update today
       
        const [tagsObject, parametersObject] = await getAllTagsCategoriesAndParameters(environment);

        const allPreviousTags = tagsObject.tags;
        const allPreviousParameters = parametersObject.parameters;
        const allPreviousCategories = await getCategoriesFromDbDash();

        const allPreviousTagsSet = new Set(allPreviousTags)
        const allPreviousCategoriesSet = new Set(allPreviousCategories.map(category => category.name));
        const nameToSlugnameMap = new Map(allPreviousCategories.map(category => [category.name, category.slug]));

        const allPreviousParametersSet = new Set(allPreviousParameters);
       
        const notAvailableTags = [] // all tags that are not present in  our database 
        const notAvailableParameters = [] // all tags that are not present in  our database 
        const notAvailableCategories = new Set() // all tags that are not present in  our database 

        const tagToBridgeArrMap = {}; // keep map of which tag is used in which bridge
        const parameterToBridgeArrMap = {}; // keep map of which tag is used in which bridge
        const categoryToBridgeArrMap = {};
        const brigeToAllTagsAndParametersMap = {};

        allBLogTags.forEach(item => {
          // Track unavailable tags, parameters, and categories
          const missingTags = item.tags?.filter(tag => !allPreviousTagsSet.has(tag)) || [];
          const missingParameters = Object.keys(item.meta || {}).filter(param => !allPreviousParametersSet.has(param)) || [];
          const category = item?.meta?.category;
  
          notAvailableTags.push(...missingTags);
          notAvailableParameters.push(...missingParameters);
  
          // if (category && !allPreviousCategoriesSet.has(category)) {
            notAvailableCategories.add(
              JSON.stringify(
                { category : category,
                  title : item.title,
                  id : item._id
                }));
            categoryToBridgeArrMap[category] = [...(categoryToBridgeArrMap[category] || []), item._id];
          // }
          // return  res.status(201).json({ success: true, data: [] });
  
          // Map tags, parameters, and categories to blog entries
          missingTags.forEach(tag => {
              tagToBridgeArrMap[tag] = [...(tagToBridgeArrMap[tag] || []), item._id];
          });
  
          missingParameters.forEach(param => {
              parameterToBridgeArrMap[param] = [...(parameterToBridgeArrMap[param] || []), item._id];
          });
  
          brigeToAllTagsAndParametersMap[item._id] = {
              tags: new Set(item.tags),
              meta: item.meta
          };
      });

       
        const aiResponses = await Promise.all([
          askAi(MERGE_TAGS_BRIDGE_ID, `list of new tags :-${notAvailableTags.join(", ")}`, { allPreviousTags }),
          askAi(MERGE_PARAMETERS_BRIDGE_ID, `list of new parameters :-${notAvailableParameters.join(", ")}`, { allPreviousParameters }),
          askAi(MERGE_CATGORIES_BRIDGE_ID, `list of new categories :-${Array.from(notAvailableCategories).join(", ")}`, { allPreviousCategories })
        ]);


        const [aiResponseTags, aiResponseParameters, aiResponseCategories] = aiResponses.map(res => JSON.parse(res?.response?.data?.content));

        applyReplacements(aiResponseTags, tagToBridgeArrMap, (id, originalTag) => {
          brigeToAllTagsAndParametersMap[id].tags.delete(originalTag);
          brigeToAllTagsAndParametersMap[id].tags.add(originalTag);
        });

        // applyReplacements(aiResponseCategories, categoryToBridgeArrMap, (id, originalCategory) => {
        //   brigeToAllTagsAndParametersMap[id].meta.category = originalCategory;
        // });
        const transformedCategories = aiResponseCategories?.categories?.reduce((acc, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {});
        
        const newCategories = [];
        Object.keys(transformedCategories).forEach(key => {
          if (brigeToAllTagsAndParametersMap[key]?.meta?.category) {
            brigeToAllTagsAndParametersMap[key].meta.category = transformedCategories[key];
            brigeToAllTagsAndParametersMap[key].meta.categorySlug = nameToSlugnameMap.get(transformedCategories[key]) || 'it';
            if (!allPreviousCategoriesSet.has(transformedCategories[key])) newCategories.push(transformedCategories[key]);
          }
        });

        applyReplacements(aiResponseParameters, parameterToBridgeArrMap, (id, originalParameter, replacement) => {
          const data = brigeToAllTagsAndParametersMap[id].meta[replacement];
          delete brigeToAllTagsAndParametersMap[id].meta[replacement];
          brigeToAllTagsAndParametersMap[id].meta[originalParameter] = data;
        });

        await Promise.all([
          blogServices.updateBlogsTags(brigeToAllTagsAndParametersMap, environment),
          addNewTags(aiResponseTags.newTags, environment),
          addNewParmeters(aiResponseParameters.newParameters, environment),
          // addNewCategories(aiResponseCategories.newCategories, environment)
          // addCategoriesToDbDash(newCategories) // add to db dash()
      ]);
        res.status(201).json({ success: true, data: [] });
        // res.status(201).json({ success: true, data: allTags });
      } catch (error) {
        console.error("error in merging tags and categories", error)
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}

export async function getCategoriesFromDbDash() {
  const response = await fetch('https://table-api.viasocket.com/65d2ed33fa9d1a94a5224235/tblh9c91k', {
    method: 'GET',
    headers: {
      'auth-key': process.env.DBDASH_VIASOCKET_WEBSITE_KEY
    }
  });

  const data = await response.json();
  const categories = data.data.rows.map((row) => {return {name:row.name,slug:row.slug}}).filter(row => row.name !== 'All');
  return categories;
}

// async function addCategoriesToDbDash(categories) {
//   await fetch('https://table-api.viasocket.com/65d2ed33fa9d1a94a5224235/tblh9c91k', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'auth-key': process.env.DBDASH_VIASOCKET_WEBSITE_KEY
//     },
//     body: JSON.stringify({
//       records: categories.map(category => ({
//         name: category,
//         hidden: true
//       }))
//     })
//   });
// }
