import blogServices from "@/services/blogServices";
import { askAi } from "@/utils/utils";
import axios from "axios";

export default async function handler(req, res) {
  const { method } = req;
  const MERGE_TAGS_BRIDGE_ID = "670d05b53d8054efee36bd5e";
  switch (method) {
    case 'POST':
      try {
        const allTags = (await blogServices.getAllBlogTags())[0].allTags;
        console.log(allTags);
        const aiResponse = await askAi(MERGE_TAGS_BRIDGE_ID, allTags.join(", "))
        .then(res => JSON.parse(res.response.data.content));
        res.status(201).json({ success: true, data: aiResponse });  
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
