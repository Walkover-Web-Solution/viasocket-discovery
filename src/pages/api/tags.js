import blogServices from "@/services/blogServices";
import { addNewTags, getAllTags } from "@/services/tagsServices";
import { askAi } from "@/utils/utils";
import axios from "axios";

export default async function handler(req, res) {
  const { method } = req;
  const MERGE_TAGS_BRIDGE_ID = "670d05b53d8054efee36bd5e";
  switch (method) {
    case 'POST':
      try {
        const allBLogTags = await blogServices.getAllBlogTags() // all blog that are created or update today
        const allPreviousTags = (await getAllTags())[0]?.tags  // all saved or known tags 
        const allPreviousTagsSet = new Set(allBLogTags)
        const notAvailableTags = [] // all tags that are not present in  our database 
        const tagToBridgeArrMap = {}; // keep map of which tag is used in which bridge

        const brigeToAllTagsMap = allBLogTags.reduce((acc, item) => {
          const notAvailableTag = item.tags?.filter((tag) => !allPreviousTagsSet.has(tag))
          notAvailableTags.push(...notAvailableTag);

          notAvailableTag?.forEach((tag)=>{
            if (!tagToBridgeArrMap[tag]) {
              tagToBridgeArrMap[tag]=[item._id]
            }
            else {
              tagToBridgeArrMap[tag].push(item._id)
            }
          })
          acc[item._id] = new Set (item.tags)
          
          return acc;
        }, {});

      
        const aiResponseJson = JSON.parse((await askAi(MERGE_TAGS_BRIDGE_ID, "list of new tags :-"+notAvailableTags.join(", "), {allPreviousTags}))?.response?.data?.content)
        Object.entries(aiResponseJson.replaced).map(([previousTag, newTagsToReplaceArr])=>{
          newTagsToReplaceArr.forEach((tag)=>{
                tagToBridgeArrMap[tag].forEach(brige_id => {
                  brigeToAllTagsMap[brige_id].delete(tag);
                  brigeToAllTagsMap[brige_id].add(previousTag)
                });
              })
        })
       

       await blogServices.updateBlogsTags(brigeToAllTagsMap)
       await addNewTags(aiResponseJson?.newTags)
        res.status(201).json({ success: true, data: []});
        // res.status(201).json({ success: true, data: allTags });
      } catch (error) {
        console.log("error getting releted blogs", error)
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
