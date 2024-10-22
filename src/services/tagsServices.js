const { default: dbConnect } = require("../../lib/mongoDb");
import createTagModel from "../../models/tagsModel";


const withTagModel = async (environment, callback) => {
  const client = await dbConnect(environment);
  const tagsModel = createTagModel(client);
  return callback(tagsModel);
};


export const getAllTags = async (environment) => {
  return withTagModel(environment, (tagsModel) => {
    return tagsModel.find();
  })
}



export const addNewTags = async (newTags,environment) => {
  return withTagModel(environment, (tagsModel) => {
    return tagsModel.findOneAndUpdate({},
      { $addToSet: { tags: { $each: newTags } } }
    );
  })
}


export const searchTags = async (search,environment) => {
  return withTagModel(environment, (tagsModel) => {
    return  tagsModel.aggregate([
      {
        $project: {
          matchingTags: {
            $filter: {
              input: "$tags", // The array you want to filter
              as: "tag",
              cond: { $regexMatch: { input: "$$tag", regex :search, options: "i" } } // Use regex to filter
            }
          }
        }
      }
    ])
    
    
  })
}



