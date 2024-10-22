const { default: dbConnect } = require("../../lib/mongoDb");
const { default: tagsModel } = require("../../models/tagsModel");







export  const getAllTags = async () => {
    await dbConnect();
   
      return await tagsModel.find();
  }



export  const addNewTags = async (newTags) => {
  await dbConnect();
 
    return await tagsModel.findOneAndUpdate({},
      
      { $addToSet: { tags: { $each: newTags } } } 
      
      );
}

