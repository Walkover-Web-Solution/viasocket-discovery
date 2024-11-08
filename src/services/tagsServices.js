const { default: dbConnect } = require("../../lib/mongoDb");
import mongoose from "mongoose";
import createTagModel from "../../models/tagsModel";
const { ObjectId } = require('mongodb'); // Ensure you are importing ObjectId

const config = {
  tags: "671244e8e3d6d4cb9c942fee",
  category:  "671a18652fc328336eb94e5e"  ,
  parameters: "671a18452fc328336eb94e5d" ,
}
const withTagModel = async (environment, callback) => {
  const client = await dbConnect(environment);
  const tagsModel = createTagModel(client);
  return callback(tagsModel);
};


export const getAllTagsCategoriesAndParameters = async (environment) => {
  return withTagModel(environment, (tagsModel) => {
    return tagsModel.find().lean();
  })
}


export const addNewTags = async (newTags, environment) => {
  return withTagModel(environment, (tagsModel) => {
    return tagsModel.findOneAndUpdate({ _id: config.tags},
      { $addToSet: { tags: { $each: newTags } } }
    );
  })
}
export const addNewParmeters = async (newParameters, environment) => {
  return withTagModel(environment, (tagsModel) => {
    return tagsModel.findOneAndUpdate({ _id: config.parameters},
      { $addToSet: { parameters: { $each: newParameters } } }
    );
  })
}

export const addNewCategories = async (addNewCategories, environment) => {
  return withTagModel(environment, (tagsModel) => {
    return tagsModel.findOneAndUpdate({ _id: config.category},
      { $addToSet: { categories: { $each: addNewCategories } } }
    );
  })
}

export const searchTags = async (search, environment) => {
  return withTagModel(environment, async (tagsModel) => {

    return await tagsModel.aggregate([
      {
        $match: {
          _id: new ObjectId(config.tags) 
        }
      },
      {
        $project: {
          matchingTags: {
            $filter: {
              input: "$tags", 
              as: "tag",
              cond: { $regexMatch: { input: "$$tag", regex: search, options: "i" } }
            }
          }
        }
      }
    ])


  })
}



